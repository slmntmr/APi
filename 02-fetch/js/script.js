import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
    updateUser,
} from "./user-api.js";

const tblUsers = document.getElementById("tblUsers");
const tbodyUsers = tblUsers.querySelector("tbody");
const frmUser = document.getElementById("frmUser");
const txtFirstName = document.getElementById("txtFirstName");
const txtLastName = document.getElementById("txtLastName");
const txtEmail = document.getElementById("txtEmail");
const btnSubmit = document.getElementById("btnSubmit");

const addUser = async () => {
	const firstName = txtFirstName.value;
	const lastName = txtLastName.value;
	const email = txtEmail.value;

	const user = {
		firstName,
		lastName,
		email,
	};

	await createUser(user);
	init();
	frmUser.reset();
};

const editUser = async (id) => {
	const user = await getUserById(id);
	const { firstName, lastName, email } = user;
	txtFirstName.value = firstName;
	txtLastName.value = lastName;
	txtEmail.value = email;
};

const saveUser = async (id) =>{
    const firstName = txtFirstName.value;
	const lastName = txtLastName.value;
	const email = txtEmail.value;

	const user = {
		firstName,
		lastName,
		email,
	};

	await updateUser(id, user);
	init();
	frmUser.reset();
    frmUser.dataset.method = "create";
    btnSubmit.innerHTML = "➕ Add"
}

const renderUserList = (users) => {
	let strUsers = "";

	users.forEach((item, index) => {
		strUsers += `<tr>
                        <td>${index + 1}</td>
                        <td>${item.firstName}</td>
                        <td>${item.lastName}</td>
                        <td>${item.email}</td>
                        <td style="width:100px; text-nowrap">
                            <button class="btn btn-info btn-sm btn-edit" data-id="${
								item.id
							}">✍️</button>
                            <button class="btn btn-danger btn-sm btn-del" data-id="${
								item.id
							}">🗑️</button></td>
                    </tr>`;
	});
	return strUsers;
};

const init = async () => {
	const users = await getAllUsers();
	const strUsers = renderUserList(users);
	tbodyUsers.innerHTML = strUsers;
};

init();

tbodyUsers.addEventListener("click", async (e) => {
	const userId = e.target.dataset.id;
	if (!userId) return;

	if (e.target.classList.contains("btn-del")) {
		const res = confirm("Are you sure to delete?");
		if (!res) return;
		await deleteUser(userId);
		init();
	} else if (e.target.classList.contains("btn-edit")) {
		editUser(userId);
		window.scrollTo(0, 0);
		btnSubmit.innerHTML = "💾 Update";
		frmUser.dataset.method = "update";
		frmUser.dataset.id = userId;
	}
});

frmUser.addEventListener("submit", (e) => {
	e.preventDefault();
	const method = e.target.dataset.method;
	const userId = e.target.dataset.id;

	if (method === "create") {
		addUser();
	} else {
        saveUser(userId)
	}
});
