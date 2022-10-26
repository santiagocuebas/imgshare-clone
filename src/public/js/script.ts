
import { Image } from './types.js';

// JS for Nav

const logoutNav = document.querySelector('.out-nav') as HTMLElement;
const avatarNav = document.querySelector('.avatar-nav') as HTMLElement;

function getUserOptions () {
	const userId: string | null = avatarNav.getAttribute('data-id');
	const optionsNav: HTMLElement = document.createElement('DIV');
	optionsNav.setAttribute('class', 'options-nav');

	if (typeof userId === 'string') {
		optionsNav.innerHTML = `
		<div class="header-nav">${userId}</div>
		<div class="body-nav">
			<div class="option-nav">
				<a class="link-option-nav" href="/user/${userId}/post">
					<i class="fa-regular fa-images"></i>
					<p>Post</p>
				</a>
			</div>
			<div class="option-nav">
				<a class="link-option-nav" href="/user/${userId}/comments">
					<i class="fa-regular fa-comments"></i>
					<p>Comments</p>
				</a>
			</div>
			<div class="option-nav">
				<a class="link-option-nav" href="/user/${userId}/about">
					<i class="fa-regular fa-file-lines"></i>
					<p>About</p>
				</a>
			</div>
			<div class="option-nav">
				<a class="link-option-nav" href="/user/${userId}/upload">
					<i class="fa-solid fa-file-arrow-up"></i>
					<p>Upload</p>
				</a>
			</div>
			<div class="option-nav">
				<a class="link-option-nav" href="/user/${userId}/settings">
					<i class="fa-solid fa-gear"></i>
					<p>Settings</p>
				</a>
			</div>
			<div class="option-nav">
				<a class="link-option-nav" href="/logout">
					<i class="fa-solid fa-arrow-right-from-bracket"></i>
					<p>Log Out</p>
				</a>
			</div>
		</div>
	`;
	}

	logoutNav.appendChild(optionsNav);
	logoutNav.removeEventListener('click', getUserOptions);
	optionsNav.addEventListener('mouseleave', () => {
		logoutNav.removeChild(optionsNav);
		logoutNav.addEventListener('click', getUserOptions);
	});
}

if (logoutNav !== null) {
	logoutNav.addEventListener('click', getUserOptions);
}

// JS for Gallery

const selectGallery = document.querySelector('.select-gallery') as HTMLElement;
const indexGallery = document.querySelector('.index-gallery') as HTMLElement;

function callList () {
	const getAllFragments = (images: Image[]): DocumentFragment => {
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

	const addImages = async (e: Event) => {
		const directionText = e.target as HTMLElement;
		selectGallery!.removeChild(list);
		if (typeof directionText.textContent === 'string') {
			document.querySelector('.text-select-gallery')!.textContent = directionText.textContent;
			indexGallery!.innerHTML = '';
			const res = await fetch(`/gallery/alter/${directionText.textContent.toLowerCase()}`);
			const res2: Image[] | string = await res.json();
			if (res2 instanceof Array) indexGallery!.append(getAllFragments(res2));
			else indexGallery!.innerHTML = res2;
		}
		selectGallery.addEventListener('click', callList);
	};

	selectGallery.removeEventListener('click', callList);

	const list: HTMLElement = document.createElement('DIV');
	const newOption: HTMLElement = document.createElement('DIV');
	const oldOption: HTMLElement = document.createElement('DIV');
	const bestOption: HTMLElement = document.createElement('DIV');

	list.setAttribute('class', 'list-gallery');
	newOption.setAttribute('class', 'options-gallery');
	oldOption.setAttribute('class', 'options-gallery');
	bestOption.setAttribute('class', 'options-gallery');

	newOption.textContent = 'NEWEST';
	oldOption.textContent = 'OLDEST';
	bestOption.textContent = 'BEST';

	newOption.addEventListener('click', addImages);
	oldOption.addEventListener('click', addImages);
	bestOption.addEventListener('click', addImages);

	list.appendChild(newOption);
	list.appendChild(oldOption);
	list.appendChild(bestOption);
	selectGallery.appendChild(list);

	list.addEventListener('mouseleave', () => {
		selectGallery.removeChild(list);
		selectGallery.addEventListener('click', callList);
	});
}

if (selectGallery !== null) {
	selectGallery.addEventListener('click', callList);
}

const fileAvatar = document.getElementById('file-avatar') as HTMLInputElement;
const fileImage = document.getElementById('file-img') as HTMLElement;

if (fileAvatar !== null) {
	const readFile = (file: Blob) => {
		const reader: FileReader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', (e: Event) => {
			const urlDirection = e.target as FileReader;
			if (fileImage !== null && urlDirection !== null) {
				const direction: string | ArrayBuffer | null = urlDirection.result;
				if (typeof direction === 'string') {
					fileImage.setAttribute('src', direction);
				}
			}
		});
	};

	fileAvatar.addEventListener('change', () => {
		const file: FileList | null = fileAvatar.files;
		if (file !== null) {
			readFile(file[0]);
		}
	});
}

// JS for Input

const inputComment = document.getElementById('input-comment') as HTMLInputElement;
const formComment = document.getElementById('form-comment') as HTMLElement;

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

const btnDelete = document.querySelector('.delete-image') as HTMLElement;

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
			const res2: string = await res.json();
			window.location.href = res2;
		}
	});
}

// JS for Likes

const like = document.getElementById('like') as HTMLElement;
const containerLikes = document.getElementById('c-likes') as HTMLElement;
const dislike = document.getElementById('dislike') as HTMLElement;
const containerDislikes = document.getElementById('c-dislike') as HTMLElement;

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

// JS for Form

const bodySign = document.querySelector('.body-sign') as HTMLElement;
const errorSign = document.querySelectorAll('.i-sign') as NodeListOf<HTMLElement>;

if (errorSign !== null) {
	for (const e of errorSign) {
		e.addEventListener('click', () => {
			const id = e.getAttribute('data-id');
			if (typeof id === 'string') {
				const element = document.getElementById(`${id}`);
				bodySign.removeChild(element!);
			}
		});
	}
}

//  JS for Delete Comments

const iconComments = document.querySelectorAll('.container-icon-comment') as NodeListOf<HTMLElement>;

function createNewBox (e: Event) {
	const comment = (<CustomEvent>e).detail;
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
