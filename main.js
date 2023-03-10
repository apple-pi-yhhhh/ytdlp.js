const exec = require('child_process').execSync

switch(process.platform){
case 'win32':
    var runsh = 'yt-dlp.exe'
    break
case 'darwin':
    var runsh = 'yt-dlp_macos'
    break
case 'linux':
    var runsh = 'yt-dlp_linux'
    break
default:
    throw 'Platform not supported.'
}
const path = `${__dirname}/ytdlp-releases/${runsh}`
const ytdl = {
dl: (url,option) => {
    try{
        exec(`${path} ${url} ${[
            `-N ${option.core || 1}`,                   // core
            `-o "${option.output || '%(id)s.%(ext)s'}"`,// output
            '--no-cache-dir',                           // no cache
            option.audio ? `-x --audio-format ${option.format || 'mp3'}` : `-f ${option.format}`,// audio only
        ].join(' ')}`)
        return { status: true }
    }catch(e){
        if(e.status != 0){
            return { status: false, detail: e.stderr.toString() }
        }
    }
},
info: url => {
    try{
        const result = exec(`${path} ${url} -j`).toString()
        return { status: true, return: JSON.parse(result) }
    }catch(e){
        if(e.status != 0){
            return { status: false, detail: e.stderr.toString() }
        }
    }
},
update: ()=>{
    try{
        exec(`${path} --update`)
        return { status: true }
    }catch(e){
        if(e.status != 0){
            return { status: false, detail: e.stderr.toString() }
        }
    }
}
}

module.exports = ytdl