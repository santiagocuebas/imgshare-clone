'use strict';

// JS for Nav

const logoutNav = document.querySelector('.out-nav');
const avatarNav = document.querySelector('.avatar-nav');

function getUserOptions () {
	const userId = avatarNav.getAttribute('data-id');
	const optionsNav = document.createElement('DIV');
	optionsNav.setAttribute('class', 'options-nav');

	if (typeof userId === 'string') {
		optionsNav.innerHTML = `<div class="header-nav">${userId}</div>`;

		const bodyNav = document.createElement('DIV');
		bodyNav.setAttribute('class', 'body-nav');

		const obj = [
			{text: 'Post', myClass: 'fa-regular fa-images'},
			{text: 'Comments', myClass: 'fa-regular fa-comments'},
			{text: 'About', myClass: 'fa-regular fa-file-lines'},
			{text: 'Upload', myClass: 'fa-solid fa-file-arrow-up'},
			{text: 'Settings', myClass: 'fa-solid fa-gear'},
		];

		const fragment = document.createDocumentFragment();

		for (const { text, myClass } of obj) {
			const optionNav = document.createElement('DIV');
			optionNav.setAttribute('class', 'option-nav');
			optionNav.innerHTML = `
				<a class="link-option-nav" href="/user/${userId}/${text.toLowerCase()}">
					<i class="${myClass}"></i>
					<p>${text}</p>
				</a>
			`;
			fragment.append(optionNav);
		}

		bodyNav.appendChild(fragment);

		const optionNav = document.createElement('DIV');
		optionNav.setAttribute('class', 'option-nav');

		const logout = document.createElement('A');
		logout.setAttribute('class', 'link-option-nav');
		logout.setAttribute('href', '/logout');
		logout.innerHTML = `
			<i class="fa-solid fa-arrow-right-from-bracket"></i>
			<p>Log Out</p>
		`;

		optionNav.appendChild(logout);

		bodyNav.appendChild(optionNav);

		optionsNav.appendChild(bodyNav);
		
		logout.addEventListener('click', async e => {
			e.preventDefault();
		
			const redirect = await fetch('/logout', {
				method: 'POST'
			}).then(res => res.json());
		
			window.location.href = redirect;
		});
	}

	logoutNav.appendChild(optionsNav);
	logoutNav.removeEventListener('click', getUserOptions);
	optionsNav.addEventListener('mouseleave', () => {
		optionsNav.remove();
		logoutNav.addEventListener('click', getUserOptions);
	});
}

if (logoutNav !== null) {
	logoutNav.addEventListener('click', getUserOptions);
}

// JS for Gallery

const selectGallery = document.querySelector('.select-gallery');
const indexGallery = document.querySelector('.index-gallery');

function callList () {
	const getAllFragments = (images) => {
		const fragment = new DocumentFragment();
		for (const image of images) {
			const box = document.createElement('DIV');
			box.setAttribute('class', 'box-gallery');
			box.innerHTML = `
				<a href="/gallery/${image.uniqueId}" class="link-gallery">
					<div class="text-gallery">
						<h2>
							${image.title}
						</h2>
						<div>
							${image._id}
							${image.totalLikes}
							${image.totalDislikes}
							${image.views}
						</div>
					</div>
				</a>
				<img src="/uploads/${image.filename}" class="image-gallery">
			`;
			fragment.append(box);
		}
		return fragment;
	};

	const addImages = async (e) => {
		const directionText = e.target;
		selectGallery.removeChild(list);
		if (typeof directionText.textContent === 'string') {
			document.querySelector('.text-select-gallery').textContent = directionText.textContent;
			indexGallery.innerHTML = '';
			const res = await fetch(`/gallery/alter/${directionText.textContent.toLowerCase()}`);
			const res2 = await res.json();
			if (res2 instanceof Array) indexGallery.append(getAllFragments(res2));
			else indexGallery.innerHTML = res2;
		}
		selectGallery.addEventListener('click', callList);
	};

	selectGallery.removeEventListener('click', callList);

	const list = document.createElement('DIV');
	list.setAttribute('class', 'list-gallery');

	const texts = ['NEWEST', 'OLDEST', 'BEST'];

	const fragment = document.createDocumentFragment();

	for (const text of texts) {
		const option = document.createElement('DIV');
		option.setAttribute('class', 'options-gallery');
		option.textContent = text;
		option.addEventListener('click', addImages);

		fragment.append(option);
	}

	list.appendChild(fragment);
	selectGallery.appendChild(list);

	list.addEventListener('mouseleave', () => {
		selectGallery.removeChild(list);
		selectGallery.addEventListener('click', callList);
	});
}

if (selectGallery !== null) {
	selectGallery.addEventListener('click', callList);
}

// JS for Input

const inputComment = document.getElementById('input-comment');
const formComment = document.getElementById('form-comment');

function createBox () {
	const btnBox = document.createElement('DIV');
	const btnCancel = document.createElement('BUTTON');
	const btnSend = document.createElement('BUTTON');

	btnCancel.setAttribute('class', 'cancel-comment');
	btnCancel.textContent = 'CANCEL';

	btnSend.setAttribute('class', 'send-comment');
	btnSend.textContent = 'SEND';

	btnBox.setAttribute('class', 'box-comment');
	btnBox.appendChild(btnCancel);
	btnBox.appendChild(btnSend);

	formComment.appendChild(btnBox);

	btnCancel.addEventListener('click', () => {
		formComment.removeChild(btnBox);
		inputComment.addEventListener('click', createBox);
	});

	inputComment.removeEventListener('click', createBox);
}

if (inputComment !== null) {
	inputComment.addEventListener('click', createBox);
}

// JS for Delete Image

const btnDelete = document.querySelector('.delete-image');

if (btnDelete !== null) {
	btnDelete.addEventListener('click', async e => {
		e.preventDefault();
		const res = confirm('Are you sure delete this image?');
		if (res) {
			const imgId = btnDelete.getAttribute('data-id');
			const res = await fetch(`/gallery/${imgId}`, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				redirect: 'follow'
			});
			const res2 = await res.json();
			window.location.href = res2;
		}
	});
}

// JS for Likes

const like = document.getElementById('like');
const containerLikes = document.getElementById('c-likes');
const dislike = document.getElementById('dislike');
const containerDislikes = document.getElementById('c-dislike');

if (like !== null) {
	like.addEventListener('click', async () => {
		const imgId = like.getAttribute('data-id');
		const res = await fetch(`/gallery/${imgId}/like`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' }
		});
		const res2 = await res.json();
		containerLikes.textContent = `${res2.like.length}`;
		containerDislikes.textContent = `${res2.dislike.length}`;
	});
}

if (dislike !== null) {
	dislike.addEventListener('click', async () => {
		const imgId = dislike.getAttribute('data-id');
		const res = await fetch(`/gallery/${imgId}/dislike`, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' }
		});
		const res2 = await res.json();
		containerDislikes.textContent = `${res2.dislike.length}`;
		containerLikes.textContent = `${res2.like.length}`;
	});
}

// JS for Delete Comments

const iconComments = document.querySelectorAll('.container-icon-comment');

function createNewBox (e) {
	const comment = e.detail;
	const containerBox = document.createElement('DIV');
	const buttonDelete = document.createElement('DIV');

	containerBox.setAttribute('class', 'menu-box-comment');
	buttonDelete.setAttribute('class', 'delete-comment');

	buttonDelete.textContent = 'Delete';

	buttonDelete.addEventListener('click', async () => {
		containerBox.remove();
		const res = confirm('Are you sure you want to delete this comment?');
		if (res) {
			const cId = comment.getAttribute('data-id');
			const dir = comment.getAttribute('data-dir');
			const res = await fetch(`/gallery/${dir}/comment/${cId}`, {
				method: 'POST',
				headers: { 'Content-type': 'application/json' }
			});
			const res2 = await res.json();
			window.location.href = res2;
		}
	});

	containerBox.appendChild(buttonDelete);

	comment.appendChild(containerBox);

	comment.removeEventListener('click', createNewBox);

	comment.addEventListener('click', () => {
		containerBox.remove();
		comment.addEventListener('click', createNewBox);
	});
}

if (iconComments !== null) {
	for (const comment of iconComments) {
		comment.addEventListener('click', createNewBox);
	}
}

// JS for Signup

const buttonSign = document.querySelector('.button-sign');

if (buttonSign !== null) {
	buttonSign.addEventListener('click', async e => {
		e.preventDefault();

		const errors = document.querySelectorAll('.error-sign');

		if (errors !== null) {
			for (const e of errors) {
				e.remove();
			}
		}

		const formSign = document.getElementById('form-sign');
		const formData = new FormData(formSign);
		const data = await fetch(window.location.pathname, {
			method: 'POST',
			body: formData
		}
		).then(res => res.json());

		if (typeof data === 'object') {
			const boxSign = document.querySelectorAll('.box-sign');

			for (const box of boxSign) {

				for (const key of Object.keys(data)) {

					if (key === box.getAttribute('id')) {
						const errorSign = document.createElement('DIV');
						errorSign.setAttribute('class', 'error-sign');
						errorSign.innerHTML = `${data[key]}`;

						const iSign = document.createElement('I');
						iSign.classList.add('fa-solid');
						iSign.classList.add('fa-xmark');
						iSign.classList.add('i-sign');
						iSign.style.cursor = 'pointer';

						errorSign.appendChild(iSign);
						box.appendChild(errorSign);

						iSign.addEventListener('click', () => {
							errorSign.remove();
						});
					}

				}

			}
		} else if (typeof data === 'string') {
			window.location.href = data;
		}
	});
}

// JS for Settings

const body = document.getElementById('body');
const formSettings = document.querySelectorAll('.form-settings');

const getMessages = messages => {
	let message = '';

	for (const value of Object.values(messages)) {
		message += value + ' ';
	}

	return message;
};

if (formSettings !== null) {
	for (const element of formSettings) {
		if (element !== null && body !== null) {
			element.addEventListener('submit', async e => {
				e.preventDefault();
		
				const success = document.querySelector('.success-settings');
				const error = document.querySelector('.error-settings');
		
				if (success !== null) {
					success.remove();
				} else if (error !== null) {
					error.remove();
				}
		
				const formData = new FormData(element);
				const formAction = element.getAttribute('action');
		
				const data = await fetch(formAction, {
					method: 'POST',
					body: formData
				}).then(res => res.json());
				
				const messageContainer = document.createElement('DIV');
				messageContainer.setAttribute('class', data.class);

				if (typeof data.message === 'object') {
					messageContainer.textContent = getMessages(data.message);
				} else {
					messageContainer.textContent = data.message;
				}
		
				body.appendChild(messageContainer);
		
				setTimeout(() => {
					messageContainer.remove();
				}, 3000);
			});
		}
	}
}

const fileAvatar = document.getElementById('file-avatar');
const fileImage = document.getElementById('file-img');

if (fileAvatar !== null) {
	const readFile = (file) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', (e) => {
			const urlDirection = e.target;
			if (fileImage !== null && urlDirection !== null) {
				const direction = urlDirection.result;
				if (typeof direction === 'string') {
					fileImage.setAttribute('src', direction);
				}
			}
		});
	};

	fileAvatar.addEventListener('change', () => {
		const file = fileAvatar.files;
		if (file !== null) {
			readFile(file[0]);
		}
	});
}

const deleteUser = document.querySelector('.delete-user-settings');

if (deleteUser !== null) {
	deleteUser.addEventListener('click', async e => {
		e.preventDefault();

		const direction = deleteUser.getAttribute('href');
		const response = await fetch(direction,
			{ method: 'POST' }
		).then(res => res.json());

		window.location.href = response;
	});
}
