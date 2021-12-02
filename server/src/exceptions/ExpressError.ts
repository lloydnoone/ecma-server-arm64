export class ExpressError extends Error {
  public name: string
  public message: string
	public stack: string
  constructor(name: string, message: string, stack: string) {
    super(message)
    this.name = name
    this.message = message
		this.stack = stack
  }
}