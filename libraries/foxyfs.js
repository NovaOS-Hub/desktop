const opfsRoot = await navigator.storage.getDirectory();
window.foxyfs = {
	getFileHandle: async function (path1) {
		var path = path1.split("/")
		var nameofFile = path[path.length - 1]
		path[path.length - 1] = '';
		path = path.filter(function (el) {
			return el != '';
		});
		var content = {};
		if (path.length == 0) {
			var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile);
			content[nameofFile] = dirHandle
		}
		else if (path.length > 1) {
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

			for (var item of path) {
				if (item == path[0]) {

				} else {
					dirHandle = await dirHandle.getDirectoryHandle(item)
				}
			}
			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle
			}
		} else if (path.length == 1) {
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle
			}
		}
		return content[nameofFile]
	},
	init: async function () {
		var directoryHandle = await opfsRoot.getDirectoryHandle('sys', { create: true });
		directoryHandle = await opfsRoot.getDirectoryHandle('user', { create: true });
	},
	ls: async function (dir) {
		var path = dir.split("/")
		path = path.filter(function (el) {
			return el != '';
		});
		if (path.length == 0) {
			var content = {};
			for await (let [name, handle] of opfsRoot.entries()) {
				content[name] = handle.kind
			}
			return content;
		}
		var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);
		if (path.length > 1) {
			for (var item of path) {
				if (item == path[0]) {

				} else {
					dirHandle = await dirHandle.getDirectoryHandle(item)
				}
			}
			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle.kind
			}
			return content;
		} else if (path.length == 1) {
			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle.kind
			}
			return content;
		}
	},
	mkdir: async function (location, name) {
		if (location == '' || location == "/") {
			return await opfsRoot.getDirectoryHandle(name, { create: true });
		} else {
			var path = location.split("/")
			path = path.filter(function (el) {
				return el != '';
			});
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0])
			for (var item of path) {
				if (item == path[0]) {

				} else {
					dirHandle = await dirHandle.getDirectoryHandle(item)
				}
			}
			return await dirHandle.getDirectoryHandle(name, { create: true })
		}
	},
	touch: async function (location, name) {
		if (location == '' || location == "/") {
			return await opfsRoot.getFileHandle(name, { create: true });
		} else {
			var path = location.split("/")
			path = path.filter(function (el) {
				return el != '';
			});
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0])
			for (var item of path) {
				if (item == path[0]) {

				} else {
					dirHandle = await dirHandle.getDirectoryHandle(item)
				}
			}
			return await dirHandle.getFileHandle(name, { create: true })
		}
	},
	typeof: async function (path1) {
		var path = path1.split("/")
		var nameofFile = path[path.length - 1]
		path[path.length - 1] = '';
		path = path.filter(function (el) {
			return el != '';
		});
		var content = {};
		if (path.length == 0) {
			var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile);
			content[nameofFile] = dirHandle.kind
		}
		else if (path.length > 1) {
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

			for (var item of path) {
				if (item == path[0]) {

				} else {
					dirHandle = await dirHandle.getDirectoryHandle(item)
				}
			}
			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle.kind
			}
		} else if (path.length == 1) {
			var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

			var content = {};
			for await (let [name, handle] of dirHandle.entries()) {
				content[name] = handle.kind
			}
		}
		return content[nameofFile]
	},
	read: async function (path) {
		var h =  await foxyfs.getFileHandle(path)
		var file = await h.getFile()
		return await file.text()
	},
	write: async function (path, content) {
		var h = await foxyfs.getFileHandle(path)
		var stream = await h.createWritable()
		stream.write(content)
		stream.close()
		return h;
	},
	rmfile: async function (path){
		h = await foxyfs.getFileHandle(path)
		h.remove()
	},
	rmdir: async function (path, recursive=false){
		
	}
}
foxyfs.init()