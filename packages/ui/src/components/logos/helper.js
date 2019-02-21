const computeSize = (widthProp, baseWidth, typeSize) => {
  if (widthProp) return widthProp

  const width = baseWidth && baseWidth.toString().replace(/[^0-9]/g, '')
  const defaultSize = 16
  const x = typeSize / defaultSize
  return x !== 1 ? `${baseWidth * x}px` : `${width}px`
}

export { computeSize }
