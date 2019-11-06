describe('Magikeys', () => {

    describe(' - in BODY context', () => {
        beforeEach(async () => {
            this.options = {
                expected: 'test',
                context: 'body'
            }
            this.expected_result = null
            await page.goto(PATH, { waitUntil: 'domcontentloaded' })
            await page.exposeFunction('onExpected', exp => this.expected_result = exp.join(''));
            this.sequence = await page.evaluateHandle(options => (
                new window.Magikeys(
                    options.expected,
                    exp => window.onExpected(exp),
                    {
                        exclude: ['textarea'],
                        context: options.context
                    }
                )
            ), this.options)
        })

        test('should have an input with [name="demo"]', async () => {
            const el = await page.$('[name="demo"]')
            const tagName = await el.getProperty('tagName')
            expect(el).not.toBeNull()
            expect((await tagName.jsonValue()).toLowerCase()).toEqual('input')
        })

        test('should have a textarea with [name="demo2"]', async () => {
            const el = await page.$('[name="demo2"]')
            const tagName = await el.getProperty('tagName')
            expect(el).not.toBeNull()
            expect((await tagName.jsonValue()).toLowerCase()).toEqual('textarea')
        })

        test('should have a valid Magikeys instance', async () => {
            expect(this.sequence).not.toBeUndefined()
        })

        test('should trigger the expected sequence', async () => {
            await page.type('body', this.options.expected, 100)
            await page.waitFor(200)
            expect(this.expected_result).not.toBeNull()
            expect(this.expected_result).toEqual(this.options.expected)
        })

        test('should not trigger the expected sequence', async () => {
            await page.type('body', 'azeaze', 100)
            await page.waitFor(200)
            expect(this.expected_result).toBeNull()
        })

        afterEach(async () => {
            this.sequence = null
            await jestPuppeteer.resetBrowser()
        })

    })

    describe(' - in INPUT context', () => {

        beforeEach(async () => {
            this.options = {
                expected: 'test',
                context: '[name="demo"]'
            }
            this.expected_result = null
            await page.goto(PATH, { waitUntil: 'domcontentloaded' })
            await page.exposeFunction('onExpected', exp => this.expected_result = exp.join(''));
            this.sequence = await page.evaluateHandle(options => (
                new window.Magikeys(
                    options.expected,
                    exp => window.onExpected(exp),
                    {
                        exclude: ['textarea'],
                        context: options.context
                    }
                )
            ), this.options)
        })

        test('should trigger the expected sequence', async () => {
            await page.type('[name="demo"]', this.options.expected, 100)
            await page.waitFor(200)
            expect(this.expected_result).not.toBeNull()
            expect(this.expected_result).toEqual(this.options.expected)
        })

        afterEach(async () => {
            this.sequence = null
            await jestPuppeteer.resetBrowser()
        })

    })

    describe(' - in TEXTAREA context', () => {

        beforeEach(async () => {
            this.options = {
                expected: 'test',
                context: '[name="demo2"]'
            }
            this.expected_result = null
            await page.goto(PATH, { waitUntil: 'domcontentloaded' })
            await page.exposeFunction('onExpected', exp => this.expected_result = exp.join(''));
            this.sequence = await page.evaluateHandle(options => (
                new window.Magikeys(
                    options.expected,
                    exp => window.onExpected(exp),
                    {
                        exclude: ['textarea'],
                        context: options.context
                    }
                )
            ), this.options)
        })

        test('should not trigger the expected sequence in excluded context', async () => {
            await page.type('[name="demo2"]', this.options.expected, 100)
            await page.waitFor(200)
            expect(this.expected_result).toBeNull()
        })

        afterEach(async () => {
            this.sequence = null
            await jestPuppeteer.resetBrowser()
        })

    })

})
