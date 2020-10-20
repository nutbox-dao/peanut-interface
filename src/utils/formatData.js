const formatData = (value, digit = 3) => {
  const str =
      digit != null && digit >= 0
          ? Number(value)
              .toFixed(digit)
              .toString()
          : value.toString()
  let integer = str
  let fraction = ''
  if (str.includes('.')) {
    integer = str.split('.')[0]
    fraction = '.' + str.split('.')[1]
  }
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + fraction
}

export {formatData}
