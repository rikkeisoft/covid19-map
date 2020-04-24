const getDay = (date: Date) => {
    return ("00" + date.getDate()).slice(-2) + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        date.getFullYear()
}

export {getDay}
