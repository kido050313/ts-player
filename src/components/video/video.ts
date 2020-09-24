const styles = require("./video.css");

interface Ivideo {
    url: string;
    elem: string | HTMLElement; // 联合类型
    width?: string;
    height?: string;
    autoplay?: boolean;
}

// 模版接口,规范组件开发
interface Icomponent {
    tempContainer: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}

function video(options: Ivideo) {
    return new Video(options);
}

class Video implements Icomponent {
    // 属性添加
    tempContainer;
    constructor(private settings: Ivideo) {
        this.settings = Object.assign({
            width: '100%', // 设置默认值
            height: '100%',
            autoplay: false
        }, this.settings)
        this.init();
    }
    init() {
        this.template();
        this.handle();
    }
    template() {
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.video;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}">
                    </div>
                    <div class="${styles['video-progress-suc']}">
                    </div>
                    <div class="${styles['video-progress-bar']}">
                    </div>
                </div>
                <div class="${styles['video-play']}">
                    <i class="iconfont icon-bofang"></i>
                </div>
                <div class="${styles['video-time']}">
                    <span class="">00:00</span>/<span>00:00</span>
                </div>
                <div class="${styles['video-full']}">
                    <i class="iconfont icon-quanping1"></i>
                </div>
                <div class="${styles['video-volume']}">
                    <i class="iconfont icon-yinliang"></i>
                    <div class="${styles['video-volprogress']}">
                        <div class="${styles['video-volprogress-now']}">
                        </div>
                        <div class="${styles['video-volprogress-bar']}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        // 可使用断言操作 或者typeof解决联合类型的问题
        if(typeof this.settings.elem === 'object') {
            this.settings.elem.appendChild(this.tempContainer); 
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
        }
    }
    handle() {
        const videoContent: HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`);
        const videoControl: HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-controls']}`);
        const videoPlay: HTMLElement = this.tempContainer.querySelector(`.${styles['video-play']} i`);
        const videoTimes: HTMLElement = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);
        const videoFull: HTMLElement = this.tempContainer.querySelector(`.${styles['video-full']}`);
        const videoProgress: HTMLElement = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`);
        const videoVolProgress: HTMLElement = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`);
        const videoVolum = this.tempContainer.querySelector(`.${styles['video-volume']} i`);

        let timer;
        videoContent.volume = 0.5;
        let currentVolum = 0.5;
        let flag = false; // 点击音量icon的标记

        // 是否自动播放
        if (this.settings.autoplay) {
            timer = setInterval(playing, 1000);
            videoContent.play();
        }

        // 点击视频可播放暂停
        videoContent.addEventListener('click', function (){
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        })

        // 控制条显示隐藏
        this.tempContainer.addEventListener('mouseenter', () => {
            videoControl.style.bottom = '0';
            // videoControl.style.opacity = '1';
        });
        this.tempContainer.addEventListener('mouseleave', () => {
            videoControl.style.bottom = '-80px';
            // videoControl.style.opacity = '0';
        })

        // 是否加载完毕
        videoContent.addEventListener('canplay', () => {
            console.log('canplay')
            videoTimes[1].innerText = formatTime(videoContent.duration);
        })
        // 视频播放事件
        videoContent.addEventListener('play', () => {
            console.log('play')
            videoPlay.className = 'iconfont icon-zanting'
            timer = setInterval(playing, 1000);
        })
        // 视频暂停事件
        videoContent.addEventListener('pause', () => {
            console.log('pause');
            videoPlay.className = 'iconfont icon-bofang';
            clearInterval(timer);
        })
        // 全屏
        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen();
        })

        // 进度点击
        videoProgress[0].parentNode.addEventListener('click', function(e: MouseEvent) {
            let downX = e.pageX; // 按下的坐标
            let leftX = this.getBoundingClientRect().left ;// 进度条距离左边屏幕的距离
            let scale = (downX - leftX) / this.offsetWidth;
            if(scale < 0 ) {
                scale = 0;
            } else if (scale > 1) {
                scale = 1;
            }
            videoProgress[0].style.width = scale * 100 + '%';
            videoProgress[1].style.width = scale * 100 + '%';
            videoProgress[2].style.left = scale * 100 + '%';
            videoContent.currentTime = scale * videoContent.duration;
            videoContent.play();
        }) 

        // 进度拖拽
        videoProgress[2].addEventListener('mousedown', function(e: MouseEvent) {
            let downx = e.pageX; // 按下的坐标
            let downL = this.offsetLeft; // 按下的距离
            let barWidthHalf = this.offsetWidth / 2; 
            document.onmousemove = (e: MouseEvent) => {
                // 计算比例    
                let scale = (e.pageX - downx + downL + barWidthHalf) / this.parentNode.offsetWidth;
                if(scale < 0 ) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }
                videoProgress[0].style.width = scale * 100 + '%';
                videoProgress[1].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                videoContent.currentTime = scale * videoContent.duration;
            };
            // 鼠标离开时停下,取消事件
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
            e.preventDefault();
        })

        console.log(videoVolProgress[0].parentNode)
        // 音量点击
        videoVolProgress[0].parentNode.addEventListener('click', function(e: MouseEvent) {
            let downx = e.pageX; // 按下的坐标
            let leftX = this.getBoundingClientRect().left;
            let scale = (downx - leftX ) / this.offsetWidth;
            if(scale < 0 ) {
                scale = 0;
            } else if (scale > 1) {
                scale = 1;
            }
            videoVolProgress[0].style.width = scale * 100 + '%';
            videoVolProgress[1].style.left = scale * 100 + '%';
            videoContent.volume = scale;
            // 音量被改变了,重置标记
            flag = false;
            // 静音
            if(scale === 0) {
                videoVolum.className = 'iconfont icon-52jingyin';
            } else {
                videoVolum.className = 'iconfont icon-yinliang';
            }
        })

        // 音量拖拽
        videoVolProgress[1].addEventListener('mousedown', function(e: MouseEvent) {
            let downx = e.pageX; // 按下的坐标
            let downL = this.offsetLeft; // 按下的距离
            let barWidthHalf = this.offsetWidth / 2; 
            document.onmousemove = (e: MouseEvent) => {
                // 计算比例    
                let scale = (e.pageX - downx + downL + barWidthHalf) / this.parentNode.offsetWidth;
                if(scale < 0 ) {
                    scale = 0;
                } else if (scale > 1) {
                    scale = 1;
                }
                videoVolProgress[0].style.width = scale * 100 + '%';
                this.style.left = scale * 100 + '%';
                videoContent.volume = scale;
                // 音量被改变了,重置标记
                flag = false;
                // 静音
                if(scale === 0) {
                    videoVolum.className = 'iconfont icon-52jingyin';
                } else {
                    videoVolum.className = 'iconfont icon-yinliang';
                }
            };
            // 鼠标离开时停下,取消事件
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
            e.preventDefault();
        });

        videoVolum.addEventListener('click', () => {
            // 记录未改变过音量时的第一次点击的音量
            if( flag === false ) {
                currentVolum = videoContent.volume;
            }
            flag = true;
            if(videoContent.volume !== 0 ) {
                videoContent.volume = 0;
            } else {
                videoContent.volume = currentVolum;
            }
            videoVolProgress[0].style.width = videoContent.volume * 100 + '%';
            videoVolProgress[1].style.left = videoContent.volume * 100 + '%';
            // 静音
            if(videoContent.volume === 0) {
                videoVolum.className = 'iconfont icon-52jingyin';
            } else {
                videoVolum.className = 'iconfont icon-yinliang';
            }
        })

        videoPlay.addEventListener('click', () => {
            if (videoContent.paused) {
                videoContent.play();
            } else {
                videoContent.pause();
            }
        }) 

        // 正在播放中
        function playing() {
            let scale = videoContent.currentTime / videoContent.duration;
            let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
            videoTimes[0].innerText = formatTime(videoContent.currentTime);
            videoProgress[0].style.width = scale * 100 + '%';
            videoProgress[1].style.width = scaleSuc * 100 + '%';
            videoProgress[2].style.left = scale * 100 + '%';
        }

        // 秒转时分
        function formatTime(number:number):string {
            number = Math.round(number);
            const min = Math.floor(number / 60);
            const sec = number % 60;
            return setZero(min) + ':' + setZero(sec);
        }

        // 补零函数 || padStart
        function setZero(number: number):string {
            if(number< 10) {
                return '0' + number;
            } else {
                return '' + number;
            }
        }
    }
}

export default video;