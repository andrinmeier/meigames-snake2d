export class DesktopPlayer {
    private readonly pressed: any;
    private readonly key: any;

    constructor() {
        this.pressed = {};
        this.key = {
            LEFT: "KeyA",
            UP: "KeyW",
            RIGHT: "KeyD",
            DOWN: "KeyS",
        };
        this.hookupEventListeners();
    }   

    movesLeft() {
        return this.isPressed(this.key.LEFT);
    }

    movesRight() {
        return this.isPressed(this.key.RIGHT);
    }

    hookupEventListeners() {
        window.addEventListener("keydown", this.onKeydown, false);
        window.addEventListener("keyup", this.onKeyup, false);
    }

    cleanup() {
        window.removeEventListener("keydown", this.onKeydown, false);
        window.removeEventListener("keyup", this.onKeyup, false);
    }

    onKeydown = (event) => {
        this.pressed[event.code] = true;
    };

    onKeyup = (event) => {
        this.pressed[event.code] = false;
    };

    isPressed = (keyCode) => {
        return this.pressed[keyCode];
    };
}
