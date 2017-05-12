
// -------------------Database Local Web Storage----------------------------

function saveColorStorage(data) {
	var key = savedColorSelectionKey;
	// var data = data;

	// localStorage setItem
	if ("localStorage" in window) {
		localStorage.setItem(key, data);
		// location.reload();
	} else {
		console.error("no localStorage in window");
	}

	// sessionStorage setItem
	// if ("sessionStorage" in window) {
	// sessionStorage.setItem(key.value, data.value);
	// location.reload();
	// } else {
	// alert("no sessionStorage in window");
	// }
}

function saveBGColorStorage(data) {
    var key = savedBGColorSelectionKey;
    // var data = data;

    // localStorage setItem
    if ("localStorage" in window) {
        localStorage.setItem(key, data);
        // location.reload();
    } else {
        console.error("no localStorage in window");
    }

    // sessionStorage setItem
    // if ("sessionStorage" in window) {
    // sessionStorage.setItem(key.value, data.value);
    // location.reload();
    // } else {
    // alert("no sessionStorage in window");
    // }
}



function removeStorage() {
	var key = document.getElementById('removeKey');

	// localStorage removeItem
	if ("localStorage" in window) {
		if (localStorage.length > 0) {
			localStorage.removeItem(key.value);
			location.reload();
		}
	} else {
		alert("no localStorage in window");
	}

	// sessionStorage removeItem
	// if ("sessionStorage" in window) {
	// if (sessionStorage.length > 0) {
	// sessionStorage.removeItem(key.value);
	// location.reload();
	// }
	// } else {
	// alert("no sessionStorage in window");
	// }
}

function clearStorage() {
	// localStorage clear
	if ("localStorage" in window) {
		if (localStorage.length > 0) {
			localStorage.clear();
			location.reload();
		}
	} else {
		alert("no localStorage in window");
	}

	// sessionStorage clear
	// if ("sessionStorage" in window) {
	// if (sessionStorage.length > 0) {
	// sessionStorage.clear();
	// location.reload();
	// }
	// } else {
	// alert("no sessionStorage in window");
	// }
}

// -----------------------------End-----------------------------------------
