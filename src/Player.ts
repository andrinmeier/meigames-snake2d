export class Player {
    private readonly pressed: any;
    private readonly handled: any;
    private readonly key: any;

    constructor() {
        this.pressed = {};
        this.handled = {
            ArrowLeft: false,
            ArrowUp: false,
            ArrowRight: false,
            ArrowDown: false
        };
        this.key = {
            LEFT: "ArrowLeft",
            UP: "ArrowUp",
            RIGHT: "ArrowRight",
            DOWN: "ArrowDown",
        };
        this.hookupEventListeners();
    }

    movesUp() {
        return this.isPressed(this.key.UP);
    }    

    movesDown() {
        return this.isPressed(this.key.DOWN);
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

    onKeydown = (event) => {
        this.pressed[event.code] = true;
    };

    onKeyup = (event) => {
        this.pressed[event.code] = false;
        this.handled[event.code] = false;
    };

    isPressed = (keyCode) => {
        let isPressed =
            this.pressed[keyCode] !== undefined &&
            this.pressed[keyCode] &&
            this.handled[keyCode] !== undefined &&
            !this.handled[keyCode];
        if (this.pressed[keyCode] !== undefined && this.pressed[keyCode]) {
            this.handled[keyCode] = true;
        }
        return isPressed;
    };
}
