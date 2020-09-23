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
        this.tempContainer.style.className = styles.video;
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
        const videoContent = this.tempContainer.querySelector(`.${styles['video-content']}`);
        const videoControls= this.tempContainer.querySelector(`.${styles['video-controls']}`);
        const videoPlay = this.tempContainer.querySelector(`.${styles['video-play']} i`);
        const videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);

        let timer;

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

        videoPlay.addEventListener('click', () => {
            if (videoContent.paused) {
                videoContent.play();
            } else {
                videoContent.pause();
            }
        })

        // 正在播放中
        function playing() {
            videoTimes[0].innerText = formatTime(videoContent.currentTime);
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