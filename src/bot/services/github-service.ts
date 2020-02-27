import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ICreateIssueRequest, IIssue, ICommitData, IGetCommitsRequest } from '../models/github';

const defaultAxiosConfig: AxiosRequestConfig = {
    auth: {
        username: process.env.GITHUB_USER,
        password: process.env.GITHUB_TOKEN,
    },
    headers: {
        'User-Agent': 'crowbartools/crowbartools-discord-bot',
    },
};

export async function createIssue(createIssueRequest: ICreateIssueRequest): Promise<IIssue> {
    const createUrl = `https://api.github.com/repos/${createIssueRequest.repo}/issues`;
    const body = {
        title: createIssueRequest.title,
        body: createIssueRequest.body,
        labels: createIssueRequest.labels,
    };

    let response: AxiosResponse<IIssue>;
    try {
        response = await axios.post(createUrl, body, defaultAxiosConfig);
    } catch (error) {
        console.log(error);
    }

    if (response && response.status === 201) {
        return response.data;
    }

    return null;
}

export async function getRecentCommits(getCommitsRequest: IGetCommitsRequest): Promise<ICommitData[]> {
    let commitsUrl = `https://api.github.com/repos/${getCommitsRequest.branch}/commits`;
    commitsUrl += `?sha=${getCommitsRequest.branch}`;
    commitsUrl += `&since=${getCommitsRequest.sinceDateString}`;

    let response: AxiosResponse<ICommitData[]>;
    try {
        response = await axios.get<ICommitData[]>(commitsUrl, defaultAxiosConfig);
    } catch (error) {
        console.log('Error getting recent commit messages', error);
    }

    if (response && response.status == 200) {
        return response.data;
    }

    return null;
}