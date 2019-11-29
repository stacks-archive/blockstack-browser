import React, { forwardRef } from 'react'
import { Box } from '../box'
import { GridProps } from './types'

const Grid = forwardRef<any, GridProps>(
  (
    {
      templateColumns,
      gap,
      rowGap,
      columnGap,
      autoFlow,
      autoRows,
      autoColumns,
      templateRows,
      templateAreas,
      area,
      column,
      row,
      ...props
    },
    ref
  ) => (
    <Box
      ref={ref}
      display="grid"
      gridArea={area}
      gridTemplateAreas={templateAreas}
      gridGap={gap}
      gridRowGap={rowGap}
      gridColumnGap={columnGap}
      gridAutoColumns={autoColumns}
      gridColumn={column}
      gridRow={row}
      gridAutoFlow={autoFlow}
      gridAutoRows={autoRows}
      gridTemplateRows={templateRows}
      gridTemplateColumns={templateColumns}
      {...props}
    />
  )
)

export { Grid }
