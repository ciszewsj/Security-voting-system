const {body} = require("express-validator");
let success_response = body => {
    return response("SUCCESS", body);
};

let failure_response = body => {
    return response("FAILURE", body);
};

let internal_error_response = body => {
    return response("INTERNAL_ERROR", body);
}

let not_found_response = body => {
    return response("NOT_FOUND", body);
}

let unauthorized_response = body => {
    return response("UNAUTHORIZED", body);
};

let not_support_response = body => {
    return response("NOT_SUPPORT", body);
}

let response = (status, body) => {
    return {
        "status": status,
        "body": body
    }
};

module
    .exports
    .response = (status, body) => response(status, body);
module
    .exports
    .unauthorized_response = body => unauthorized_response(body);
module
    .exports
    .failure_response = body => failure_response(body);
module
    .exports
    .success_response = body => success_response(body);
module
    .exports
    .internal_error_response = body => internal_error_response(body);
module
    .exports
    .not_support_response = body => not_support_response(body);
module
    .exports
    .not_found_response = body => not_found_response(body);
