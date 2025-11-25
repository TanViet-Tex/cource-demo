export interface BeautyServiceType {
  id: number
  name?: string
  servPid: number | null
  beautyServiceChildren?: BeautyServiceType[]
  [key: string]: any
}
