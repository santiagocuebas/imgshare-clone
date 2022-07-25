'use strict'

const iComment = document.getElementById('input-comment');
const fComment = document.getElementById('form-comment');
const like = document.getElementById('like');
const cLikes = document.getElementById('c-likes');
const bDelete = document.querySelector('.btn-delete');

iComment.addEventListener('click', createBox);

function createBox() {
	const btnBox = document.createElement('DIV');
	const btnCancel = document.createElement('BUTTON');
	const btnSend = document.createElement('BUTTON');

	btnCancel.setAttribute('class', 'btn-cancel');
	btnCancel.textContent = 'CANCEL';

	btnSend.setAttribute('class', 'btn-send');
	btnSend.textContent = 'SEND';

	btnBox.setAttribute('class', 'btn-box');
	btnBox.appendChild(btnCancel);
	btnBox.appendChild(btnSend);

	fComment.appendChild(btnBox);

	btnCancel.addEventListener('click', ()=>{
		fComment.removeChild(btnBox);
		iComment.addEventListener('click', createBox);
	});

	iComment.removeEventListener('click', createBox);
};

like.addEventListener('click', (e)=>{
	const imgId = like.getAttribute('data-id');
	fetch(`/gallery/${imgId}/like`,{
		method: 'POST',
		body: JSON.stringify({}),
		headers: {'Content-type': 'application/json'}
	})
		.then(res => res.json())
		.then(res2 => cLikes.textContent = `${res2.likes}`)
});

bDelete.addEventListener('click', e=>{
	e.preventDefault();
	const res = confirm('Are you sure delete this image?');
	if (res) {
		const imgId = like.getAttribute('data-Id');
		fetch(`/gallery/${imgId}`,{
			method: 'DELETE',
			headers: {'Content-type': 'application/json'},
			redirect:'follow'
		})
			.then(res => res.json())
			.then(res => window.location.href = res);
	};
});
