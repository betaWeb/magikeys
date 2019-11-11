const pm2 = require('pm2')
const _beforeEach = async options => {
    this.options = options
    this.expected_result = null
    await page.goto(PATH, { waitUntil: 'domcontentloaded' })
    await page.exposeFunction('onExpected', exp => this.expected_result = exp.join(''));
    await page.evaluateHandle(options => (
        new window.Magikeys(
            options.expected,
            exp => window.onExpected(exp),
            {
                exclude: ['textarea'],
                context: options.context
            }
        )
    ), this.options)
}
const _afterEach = async () => {
    await jestPuppeteer.resetBrowser()
}

beforeAll(() => {
    pm2.start({
        script: 'npm run serve',
        autorestart : false
    }, err => {
        pm2.disconnect()
        if (err) throw err
    })
})

afterAll(() => {
    pm2.disconnect()
})

describe('Magikeys', () => {

    describe(' - in BODY context', () => {
        beforeEach(async () => _beforeEach({
            expected: 'test',
            context: 'body'
        }))

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

        afterEach(async () => _afterEach())

    })

    describe(' - in INPUT context', () => {

        beforeEach(async () => _beforeEach({
            expected: 'test',
            context: '[name="demo"]'
        }))

        test('should trigger the expected sequence', async () => {
            await page.type('[name="demo"]', this.options.expected, 100)
            await page.waitFor(200)
            expect(this.expected_result).not.toBeNull()
            expect(this.expected_result).toEqual(this.options.expected)
        })

        afterEach(async () => _afterEach())

    })

    describe(' - in TEXTAREA context', () => {

        beforeEach(async () => _beforeEach({
            expected: 'test',
            context: '[name="demo2"]'
        }))

        test('should not trigger the expected sequence in excluded context', async () => {
            await page.type('[name="demo2"]', this.options.expected, 100)
            await page.waitFor(200)
            expect(this.expected_result).toBeNull()
        })

        afterEach(async () => _afterEach())

    })

})
