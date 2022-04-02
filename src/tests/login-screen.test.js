import axios from 'axios';
import {findAllUsers} from "../services/users-service";
import React from "react";

jest.mock("axios");

const MOCKED_USERS = [
    {username: 'ellen_ripley', password: 'lv426', email: 'repley@weyland.com'},
    {username: 'sarah_conor', password: 'illbeback', email: 'sarah@bigjeff.com'},
]

test("mocked hello world axios works", async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({data: {message: 'hello world'}}));
    const response = await axios.get();
    expect(response.data.message).toEqual('hello world')
});

describe('sss', () => {
    test("mocked hello world axios works", async () => {
        axios.get.mockImplementation(() =>
            Promise.resolve({data: {message: 'hello world'}}));
        const response = await axios.get();
        expect(response.data.message).toEqual('hello world')
    });
})

test("find all users mock works", async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({data: {users: MOCKED_USERS}}));
    const response = await findAllUsers();
    const users = response.users;
    expect(users.length).toEqual(MOCKED_USERS.length);
    users.forEach((user, nth) => {
        expect(user.username).toEqual(MOCKED_USERS[nth].username);
    });
});

describe('fff', () => {
    test("find all users mock works", async () => {
        axios.get.mockImplementation(() =>
            Promise.resolve({data: {users: MOCKED_USERS}}));
        const response = await findAllUsers();
        const users = response.users;
        expect(users.length).toEqual(MOCKED_USERS.length);
        users.forEach((user, nth) => {
            expect(user.username).toEqual(MOCKED_USERS[nth].username);
        });
    });
})