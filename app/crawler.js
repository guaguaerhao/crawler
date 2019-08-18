const fs = require('fs')
const path = require('path')
const axios = require('axios')
const request = require('request')
const colors = require('colors')


const keyword = encodeURI('邓紫棋')
const pageSize = 30
const pageNum = 3
const opts = {
    baseUrl: `http://m.music.migu.cn/migu/remoting/scr_search_tag?rows=${pageSize}&type=2&keyword=${keyword}&pgc=${pageNum}`
}

class Crawler{
    constructor(){}
    async getSongList(){
        const res = await axios({
            method: 'get',
            url: opts.baseUrl
        })
        // 文件夹 /艺人/专辑/
        // var const let
        const singer = res.data.keyword

        return {
            singer,
            songs: res.data.musics.map(song => {
                return {
                    dir: `/${singer}/${song.albumName}`,
                    albumName: song.albumName,
                    songName: song.songName,
                    cover: song.cover,
                    mp3: song.mp3,
                }
            })
        }
    }
    async start(){
        const {singer,songs} = await this.getSongList()
        console.log(colors.green(`${singer}'s`))
        console.log(`开始下载${singer}相关的专辑歌曲`)
        let num = (pageNum - 1) * pageSize + 1
        songs.forEach(async (song,index) => {
            if (!fs.existsSync(path.join(__dirname,`/${singer}`))) {
                fs.mkdirSync(path.join(__dirname,`/${singer}`))
            }
            if (!fs.existsSync(path.join(__dirname,song.dir))){
                fs.mkdirSync(path.join(__dirname,song.dir))
            }
            const dir = path.join(__dirname,song.dir,song.songName + '.mp3')
            try {
                await request(song.mp3).pipe(fs.createWriteStream(dir)).on('close',() => {
                    console.log(`${num}. ${singer}--《${song.songName}》 下载完成。`)
                    ++num
                })
            }
            catch(e){
                console.log(`${num}. ${singer}--《${song.songName}》 下载失败。`)
                ++num
            }
        })
    }
}
const crawler = new Crawler()
crawler.start()