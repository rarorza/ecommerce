import { ICategory } from './category.interface'
import { IColors } from './colors.interface'
import { IGallery } from './gallery.interface'
import { ISizes } from './sizes.interface'
import { ISpecifications } from './specifications.interface'
import { IVendor } from './vendor.interface'

export interface IProduct {
  id: number
  pid: string
  title: string
  image: string
  description: string
  category: ICategory
  price: number
  old_price: number
  shipping_amount: number
  stock_qty: number
  in_stock: boolean
  status: string
  featured: boolean
  views: number
  rating: number
  product_rating: string
  vendor: IVendor
  specifications: ISpecifications[]
  gallery: IGallery[]
  color: IColors[]
  size: ISizes[]
  slug: string
  date: string
  orders: number
}

export interface ProductsChart {
  month: number
  products: number
}
