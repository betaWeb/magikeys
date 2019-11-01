class _old_Magikeys {

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
    constructor(expected, cb, options = {}) {
        expected.constructor === String && (expected = expected.split(''))
        this.expected = expected
        this.callback = cb
        this.options = {..._old_Magikeys._DEFAULT_OPTIONS, ...options}
        this._listened = false

        this._init()
        this.run().listen()
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
     * @return {_old_Magikeys}
     */
    static create(expected, cb, options = {}) {
        return new _old_Magikeys(expected, cb, options)
    }

    /**
     * Add sequence event listener on context
     *
     * @return {_old_Magikeys}
     */
    run() {
        try {
            this._getContext().addEventListener(
                this.options.event_name,
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
    trigger() {
        return this.callback(this.expected)
    }

    /**
     * Destroy sequence event listener on context
     *
     * @return {_old_Magikeys}
     */
    destroy() {
        try {
            this._getContext().removeEventListener(
                this.options.event_name,
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
     * @return {_old_Magikeys}
     */
    listen() {
        this._listened = true
        return this
    }

    /**
     * Mute and prevent  sequence
     *
     * @return {_old_Magikeys}
     */
    mute() {
        this._listened = false
        return this
    }

    /**
     * @return {Boolean}
     */
    isListened() {
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
     * @param {Element|EventTarget|srcElement|null} element
     * @return {Boolean}
     */
    _excluded(element = null) {
        if (!element) return true
        return this.options.exclude.some(item => {
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
    _getContext() {
        /**
         * @type {Document|Element|String}
         * @private
         */
        const _ctx = this.options.context
        if (_ctx.constructor === String) return this._getContext().querySelector(_ctx) || document
        if (_ctx.constructor.nodeType && _ctx.constructor.nodeType === Node.ELEMENT_NODE) return _ctx
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

        let key = this.options.num_keys ? (e.keyCode || e.which) : e.key
        this._charCount++
        this._sequence.push(key)

        if (this._charCount === this.expected.length || !this.expected.includes(key)) {
            if (JSON.stringify(this._sequence) === JSON.stringify(this.expected) && this.callback.constructor === Function)
                this.trigger()

            this._init()
        }
    }

}

window.Magikeys = _old_Magikeys
