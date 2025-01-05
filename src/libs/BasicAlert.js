import Swal from "sweetalert2";
import {axiosJWTIns} from "@/libs/jwt_axios";
import Cookies from "js-cookie";

export const notAuthorizedAlert = () => {
    let timerInterval
    Swal.fire({
        title: 'Urgh!! You are not authorized to see this',
        html: 'You will be redirected to the home page in  <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            window.location.href = "/"
        }
    })
}

export const notLoginAlert = () => {
    let timerInterval
    Swal.fire({
        title: 'Urgh!! Your login is expired',
        html: 'You will be redirected to the login page in  <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            Cookies.remove('authData')
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            Cookies.remove('uid')
            Cookies.remove('full_name')
            Cookies.remove('vite_username')
            Cookies.remove('join_date')
            Cookies.remove('s_token')
            Cookies.remove('s_intract')
            Cookies.remove('s2_intract')
            Cookies.remove('v_intract')
            Cookies.remove('v2_intract')

            window.location.href = "./signin"
        }
    })
}

export const somethingWentWrong = (msg) => {
    let text = ''
    if (!msg) {
        text = 'SWW! Consult Automation Team. Logout-Login will also help.'
    } else {
        text = msg
    }
    Swal.fire({
        icon: 'error',
        title: 'Ooooooopsy...',
        text: text,
        footer: '<a href="/Home">Take me back to home</a>'
    })
}

export const errorAlert = (msg) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg
    })
}

export const loginSuccess = () => {
    let timerInterval
    Swal.fire({
        title: 'Welcome '+ Cookies.get('full_name'),
        html: 'We are redirecting you to the home page in  <b></b> milliseconds.',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            window.location.href = "/dashboard"
            
        }
    })
}

export const catchError = (error) => {
    console.log(error)
    if (error.response.status === 401) {
        notLoginAlert()
    } else if (error.response.status === 404) {
        somethingWentWrong('The resource you are requesting is not found')
    } else if (error.response.status === 403) {
        notAuthorizedAlert()
    } else if (error.response.status === 500) {
        somethingWentWrong()
    } else {
        somethingWentWrong()
    }
}

export const notification = (msg, type, position,width) => {
    Swal.fire({
        position: position,
        icon: type,
        title: msg,
        showConfirmButton: false,
        timer: 1000,
        width: width
    })
}

export const sendNotification = (msg_body, provider, name) => {
    axiosJWTIns.post("/notifier", {
        'message_body': msg_body,
        'provider': provider,
        'name': name
    }).then(res => {
        if (res.data.status) {
            console.log('notification send successfully')
        } else {
            console.log('error while sending notification')
        }
    }).catch(error => console.log('error while sending notification'))
}