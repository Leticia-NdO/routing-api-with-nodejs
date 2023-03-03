export class InvalidParamError extends Error {
  constructor (paramName: string, id: number) {
    super(`Invalid param: ${paramName} - ${id}`)
    this.name = 'InvalidParamError'
  }
}
