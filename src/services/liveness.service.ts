import {
    RekognitionClient,
    CreateFaceLivenessSessionCommand,
    GetFaceLivenessSessionResultsCommand,
} from '@aws-sdk/client-rekognition';
import { fromIni } from '@aws-sdk/credential-providers';
import axios from 'axios';
import FormData from 'form-data';

interface VerificationResponse {
    data: any; // You can make this more specific based on your API response
    message?: string;
    success?: boolean;
}

interface VerificationResponse {
    data: any; // You can make this more specific based on your API response
    message?: string;
    success?: boolean;
}

const client = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: fromIni({ profile: process.env.AWS_PROFILE }),
});

export const createLivenessSessionService = async () => {
    const input = {
        Settings: {
            OutputConfig: {
                S3Bucket: process.env.S3_BUCKET,
                S3KeyPrefix: process.env.S3_KEY_PREFIX,
            },
            AuditImagesLimit: 2,
        },
    };
    const command = new CreateFaceLivenessSessionCommand(input);
    const response = await client.send(command);
    return response.SessionId;
};

export const getLivenessResultsService = async (sessionId: string) => {
    const command = new GetFaceLivenessSessionResultsCommand({
        SessionId: sessionId,
    });
    const response = await client.send(command);
    return response;
};

export const verificationRetriesService = async (data: Record<string, any>) => {
    const projectId = data.projectId;
    const userId = data.userId;
    const activity = data.activity || 'default';

    if (projectId === "CatholicPay") {
        try {
            const cpay_url = process.env.CATHOLICPAY_API_URL + '/verification/retries';
            const secret = process.env.CATHOLICPAY_SECRET_KEY;

            const response = await axios.get<VerificationResponse>(cpay_url, {
                params: {
                    user_id: userId,
                    activity: activity,
                },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${secret}`,
                },
            });

            return {
                message: 'Retries returned successfully',
                data: response?.data?.data,
                success: true,
                code: 200
            };

        } catch (error: any) {
            return {
                message: error.response?.data?.message || 'Failed to fetch retries',
                data: error.response?.data?.data || null,
                success: false,
                code: error.response?.status || 500,
            };
        }
    }

    return { message: 'Retry verification endpoint', data: null, success: false, code: 400 };
};


export const verificationUploadService = async (data: Record<string, any>, projectId: string) => {
    const userId = data.user_id;
    const session_id = data.session_id || 'default';
    const activity = data.activity || 'inapp_verification';
    const audit_image_urls = data.audit_image_urls || [];
    const confidence_level = data.confidence_level || '';
    const retries = data.retries || '';

    if (projectId === "CatholicPay") {
        try {
            const form = new FormData();
            form.append('user_id', String(userId));
            form.append('session_id', String(session_id));
            form.append('activity', String(activity));
            (audit_image_urls as string[]).filter(Boolean).forEach((url: string) => {
                form.append('audit_image_urls[]', url);
            });
            form.append('confidence_level', String(confidence_level));
            form.append('retries', String(retries));

            const cpay_url = process.env.CATHOLICPAY_API_URL + '/verification/save-liveness';
            const secret = process.env.CATHOLICPAY_SECRET_KEY;

            const response = await axios.post<VerificationResponse>(cpay_url, form,
                {
                    headers: {
                        ...form.getHeaders(),
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${secret}`,
                    },
                }
            );
            const respData = response.data as { message?: string; data?: any; success?: boolean; code?: number };
            return {
                message: respData.message || 'Liveness saved successfully',
                data: respData.data || null,
                success: respData.success ?? true,
                code: respData.code || 200
            };
        } catch (error: any) {
            return {
                message: error.response?.data?.message || 'Failed to save liveness',
                data: error.response?.data?.data || null,
                success: false,
                code: error.response?.status || 500,
            };
        }
    }
};


