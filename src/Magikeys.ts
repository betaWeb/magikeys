interface Options {
    num_keys?: Boolean
    event_name?: String
    exclude?: Array<string>
    context?: Document|Element|String
    timeout?: Number
}

class Magikeys {

    public expected: Array<string|number>

    public callback: Function

    public options: Options

    private _listened: boolean

    private _sequence: Array<string|number>

    private _charCount: number

    /**
     * @returns {{
     *      num_keys: boolean,
     *      event_name: string,
     *      exclude: string[]
     *      context: Document|Element|String,
     *      timeout: Number
     * }}
     * @private
     */
    static get _DEFAULT_OPTIONS() {
        return {
            num_keys: false,
            event_name: 'keyup',
            exclude: ['input', 'textarea'],
            context: document,
            timeout: 2000
        }
    }

    /**
     * @constructor
     * @param {Array|String} expected
     * @param {Function} cb
     * @param {Object} options
     * @param {Boolean} options.num_keys
     * @param {String} options.event_name
     * @param {String[]} options.exclude
     * @param {Document|Element|String} options.context
     * @param {Number} options.timeout
     */
    constructor(expected: String|(String|Number)[], cb: Function, options: Options = {}) {
        expected.constructor === String && (expected = (<string>expected).split(''))
        this.expected = <(string|number)[]>expected
        this.callback = cb
        this.options = {...Magikeys._DEFAULT_OPTIONS, ...options}
        this._listened = false

        this._init()
        return this.run().listen()
    }

    /**
     * @param {Array|String} expected
     * @param {Function} cb
     * @param {Object} options
     * @param {Boolean} options.num_keys
     * @param {String} options.event_name
     * @param {String[]} options.exclude
     * @param {Document|Element|String} options.context
     * @param {Number} options.timeout
     * @return {Magikeys}
     */
    static create(expected: String|(String|Number)[], cb: Function, options: Options): Magikeys {
        return new Magikeys(expected, cb, options)
    }

    /**
     * Add sequence event listener on context
     *
     * @return {Magikeys}
     */
    run(): Magikeys {
        try {
            this._getContext().addEventListener(
                this.options.event_name as string,
                this._handler.bind(this)
            )
        } catch(e) {
            console.error(e)
        }
        return this
    }

    /**
     * Trigger callback
     *
     * @return {Function}
     */
    trigger(): Function {
        return this.callback(this.expected)
    }

    /**
     * Destroy sequence event listener on context
     *
     * @return {Magikeys}
     */
    destroy(): Magikeys {
        try {
            this._getContext().removeEventListener(
                this.options.event_name as string,
                this._handler.bind(this)
            )
        } catch(e) {
            console.error(e)
        }
        return this
    }

    /**
     * Listen sequence
     *
     * @return {Magikeys}
     */
    listen(): Magikeys {
        this._listened = true
        return this
    }

    /**
     * Mute and prevent  sequence
     *
     * @return {Magikeys}
     */
    mute(): Magikeys {
        this._listened = false
        return this
    }

    /**
     * @return {Boolean}
     */
    isListened(): Boolean {
        return this._listened === true
    }

    /**
     * @return {Boolean}
     */
    isMuted() {
        return !this.isListened()
    }

    _init() {
        this._sequence = []
        this._charCount = 0
    }

    /**
     * @param {Element|null} element
     * @return {Boolean}
     */
    _excluded(element: Element|null): Boolean {
        if (!element) return true
        return this.options.exclude.some((item: string) => {
            const {classList, id, tagName} = element
            return !item || (
                (item.startsWith('.') && classList.contains(item)) ||
                (item.startsWith('#') && id === item.replace('#', '')) ||
                (/^.+?\[.+\]?$/g.test(item) && this._getContext().querySelector(item) === element) ||
                (/^[a-zA-Z]+$/gi.test(item) && tagName.toLowerCase() === item.toLowerCase())
            )
        })
    }

    /**
     * @returns {Element|Document}
     * @private
     */
    _getContext(): Element|Document {
        const _ctx = this.options.context
        if (_ctx.constructor === String)
            return document.querySelector(_ctx as string) || document

        const nodeType = (<Element|Document>_ctx).nodeType as number
        if (nodeType && nodeType === Node.ELEMENT_NODE)
            return <Element|Document>_ctx

        return document
    }

    /**
     *
     * @param {KeyboardEvent} e
     * @private
     */
    _handler(e) {
        if (this._excluded(e.target || e.srcElement)) return

        if (!document.hasFocus() || !this._listened) {
            this._init()
            return
        }

        let key = this.options.num_keys ? (e.keyCode || e.which) : e.key as string
        this._charCount++
        this._sequence.push(key)

        if (this._charCount === this.expected.length || this.expected.indexOf(key) < 0) {
            if (JSON.stringify(this._sequence) === JSON.stringify(this.expected) && this.callback.constructor === Function)
                this.trigger()

            this._init()
        }
    }

}

(<any>window).Magikeys = Magikeys
