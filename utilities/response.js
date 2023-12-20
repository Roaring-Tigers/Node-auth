
function customResponse(res, success, message, data){
    res.json({success: success, message: message, data: data})
}

export default customResponse;