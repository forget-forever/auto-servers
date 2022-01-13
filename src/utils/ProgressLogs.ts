/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import chalk from "chalk"
import nodeEmoji from 'node-emoji'
const { Spinner } = require('cli-spinner')

interface ProgressLogOptions {
    title?: string
    record?: boolean,
    loadingEffect?: number
}

interface ProgressLogItemOptions {
    color?: string | statusOptions,
    emoji?: string | statusOptions
}

interface statusOptions {
    success: string,
    warning: string,
    fail: string
}

let total = 0
let current = 0
let loadingEffect = 18

enum StopExitCode {
    success,
    fail,
    warning
}

class ProgressLogs {
    private queue: ProgressLogItem[]
    private currentLogItem: ProgressLogItem | null
    private tracker: {
        start: any,
        stop: any
    }
    private readonly options: ProgressLogOptions

    constructor(options: ProgressLogOptions) {
        total = 0
        current = 0
        loadingEffect = 18
        this.queue = []
        this.currentLogItem = null
        this.options = options
        this.tracker = {
            start: null,
            stop: null
        }
        if (options?.loadingEffect !== undefined) {
            loadingEffect = options.loadingEffect
        }
    }

    /**
     * Add log item into the log queue
     * @param title: the title of the log item
     * @param command: the command of the log item
     * @param options: the emoji config of the log item
     */
    add(title: string, command = '', options?: ProgressLogItemOptions): void {
        this.queue.push(new ProgressLogItem(title, command, options))
        total++
    }

    /**
     * Start run the log queue
     */
    start(): void {
        if (this?.options?.record) {
            this.startRecord()
        }
        if (this?.options?.title) {
            console.log(chalk.bold.dim(this.options.title))
        }
        this.run()
    }

    /**
     * run next log item in the log queue
     * @param status 
     */
    next(status: keyof typeof StopExitCode = 'success'): void {
        this.currentLogItem?.stop(StopExitCode[status])
        this.run()
    }

    /**
     * Stop the log queue with exit code
     * @param status exit status code
     */
    end(status: keyof typeof StopExitCode = 'success'): void {
        this.currentLogItem?.stop(StopExitCode[status])
        this.printRecord(StopExitCode[status])
    }

    /**
     * set global log item's emoji
     * @param options: the emoji options eg: { success: 'heart' }
     */
    setGlobalLogEmoji(options: statusOptions | string): void {
        if (options && typeof options === 'string') {
            ProgressLogItem.defaultEmojiOptions = Object.assign({}, ProgressLogItem.defaultEmojiOptions, { success: options })
        } else {
            ProgressLogItem.defaultEmojiOptions = Object.assign({}, ProgressLogItem.defaultEmojiOptions, options)
        }
    }

    /**
     * set global log item's color
     * @param options: the emoji options eg: { success: 'green' }
     */
    setGlobalLogColor(options: statusOptions | string): void {
        if (options && typeof options === 'string') {
            ProgressLogItem.defaultColorOptions = Object.assign({}, ProgressLogItem.defaultColorOptions, { success: options })
        } else {
            ProgressLogItem.defaultColorOptions = Object.assign({}, ProgressLogItem.defaultColorOptions, options)
        }
    }

    /**
     * Start the time record
     * @private
     */
    private startRecord(): void {
        if (!this.options.record) return
        this.tracker.start = process.hrtime()
    }

    /**
     * Stop the time record
     * @private
     */
    private stopRecord(): void {
        this.tracker.stop = this.tracker.start ? process.hrtime(this.tracker.start) : null
    }

    /**
     * Compute the record time and print to console
     * @private
     */
    private printRecord(exitCode?: StopExitCode): void {
        if (this.options?.record) {
            this.stopRecord()
            const exitStatement = exitCode !== 0 ? ` with exit ${chalk.yellow('code = ' + exitCode)}` : ''
            console.log(chalk.dim(`[Done]${exitStatement} in ${chalk.blue(((this.tracker.stop?.[0] * 1e9 + this.tracker.stop?.[1]) / 1000000000).toFixed(3))} seconds`))
        }
    }

    /**
     * Run log queue start the log item
     */
    private run(): void {
        if (!this.queue.length) {
            this.printRecord(StopExitCode.success)
            return
        }
        current++
        this.currentLogItem = this.queue.shift() as ProgressLogItem
        this.currentLogItem.start()
    }
}

class ProgressLogItem {
    private readonly title: string
    private readonly command: string
    private readonly options: ProgressLogItemOptions | undefined
    private spinner: typeof Spinner
    private colorData: statusOptions
    private emojiData: statusOptions
    static defaultColorOptions = {
        success: 'dim',
        fail: 'red',
        warning: 'yellow'
    }
    static defaultEmojiOptions = {
        success: 'heavy_check_mark',
        fail: 'heavy_multiplication_x',
        warning: 'warning'
    }

    constructor(title: string, command: string, options?: ProgressLogItemOptions) {
        this.title = title
        this.command = command
        this.options = options
        this.colorData = Object.assign({}, ProgressLogItem.defaultColorOptions)
        this.emojiData = Object.assign({}, ProgressLogItem.defaultEmojiOptions)
        this.init()
    }

    /**
     * Start log item
     */
    start() {
        this.spinner = new Spinner(this.getPrintMessage())
        this.spinner.setSpinnerString(loadingEffect)
        this.spinner.start()
    }

    /**
     * Stop log item with exit code
     */
    stop(exitCode: StopExitCode) {
        this.spinner.stop(true)
        console.log(this.getPrintMessage(exitCode))
    }

    /**
     * generate print message with exit code
     * @param exitCode: exit status code
     * @private
     */
    private getPrintMessage(exitCode?: StopExitCode): string {
        const prefix = this.getEmojiByExitCode(exitCode)
        const progress = `[${current}/${total}]`
        const message = ` ${this.title} [${this.command}]`
        if (exitCode !== undefined) {
            // @ts-ignore
            return chalk[this.colorData[StopExitCode[exitCode]]](`${prefix}${progress}${message}`)
        }
        return chalk.grey(`${prefix}${progress}${message}...`)
    }

    /**
     * get status emoji by exit code
     * @private
     */
    private getEmojiByExitCode(exitCode?: StopExitCode): unknown {
        if (exitCode === undefined) return ''
        // @ts-ignore
        return nodeEmoji.get(this.emojiData[StopExitCode[exitCode]])
    }

    /**
     * init color and emoji config
     */
    private init() {
        if (!this.options) return
        const { color, emoji } = this.options
        if (color && typeof color === 'string') {
            this.colorData.success = color
        } else {
            this.colorData = Object.assign({}, this.colorData, color)
        }
        if (emoji && typeof emoji === 'string') {
            this.emojiData.success = emoji
        } else {
            this.emojiData = Object.assign({}, this.emojiData, emoji)
        }
    }
}

export default ProgressLogs