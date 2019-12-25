import { UUID } from "../common"
import { EmptyBlock } from "./empty_block"
import { BlockFormat } from "./block_format"

/**
 * @category Notion Block
 */
export interface TableOfContent extends EmptyBlock {
  type: "table_of_contents"
  format?: BlockFormat
}

/**
 * Math Equation block.
 * 
 * @category Notion Block
 */
export interface Equation extends EmptyBlock {
  type: "equation"
  properties?: {
    /** LaTeX. */
    title?: [[string]]
  }
}

/**
 * Template button block.
 * 
 * @category Notion Block
 */
export interface Factory extends EmptyBlock {
  type: "factory"
  /** Template content. */
  content?: UUID[]
  properties?: {
    /** Button name. */
    title?: [[string]]
  }
}

/**
 * @category Notion Block
 */
export interface Breadcrumb extends EmptyBlock {
  type: "breadcrumb"
}

/**
 * @category Notion Block
 */
export type AdvancedBlock =
  TableOfContent | Equation | Factory | Breadcrumb