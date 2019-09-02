export const acceptForm = status => {
  if(status.alwaysAccept === true){
    return true
  }
  let shouldAccept = true
  for(let field of Object.values(status)){
    if(field.isValid !== true || field.isEmpty === false){
      shouldAccept = false
    }
  }
  return shouldAccept
}