import {
    RekognitionClient,
    CreateFaceLivenessSessionCommand,
    GetFaceLivenessSessionResultsCommand,
} from '@aws-sdk/client-rekognition';
import axios from 'axios';
import FormData from 'form-data';
import 'dotenv/config';

// ==================== TYPES ====================

interface VerificationResponse {
    data?: any;
    message?: string;
    success?: boolean;
    code?: number;
}

interface VerificationUploadedResponse {
    data?: any;
    message?: string;
    status?: number;
    success?: boolean;
    code?: number;
}

interface ServiceResult {
    message: string;
    data: any;
    success: boolean;
    code: number;
}

interface LivenessSessionSettings {
    outputBucket?: string;
    keyPrefix?: string;
    auditImagesLimit?: number;
}

interface VerificationData {
    user_id: string | number;
    session_id?: string;
    activity?: string;
    audit_image_urls?: string[];
    confidence_level?: string | number;
    retries?: string | number;
}

interface RetriesData {
    projectId: string;
    userId: string | number;
    activity?: string;
}

// ==================== CONSTANTS ====================

const SUPPORTED_PROJECTS = {
    CATHOLIC_PAY: 'CatholicPay'
} as const;

const DEFAULT_VALUES = {
    ACTIVITY: 'default',
    INAPP_ACTIVITY: 'registration',
    SESSION_ID: 'default',
    AUDIT_IMAGES_LIMIT: 2
} as const;

const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
} as const;

// ==================== CLIENT CONFIGURATION ====================

const createRekognitionClient = (): RekognitionClient => {    
    return new RekognitionClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });
};

const rekognitionClient = createRekognitionClient();

// ==================== UTILITY FUNCTIONS ====================

const createErrorResponse = (
    message: string, 
    data: any = null, 
    code: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): ServiceResult => ({
    message,
    data,
    success: false,
    code
});

const createSuccessResponse = (
    message: string, 
    data: any = null, 
    code: number = HTTP_STATUS.OK
): ServiceResult => ({
    message,
    data,
    success: true,
    code
});

const getAuthHeaders = (secretKey: string) => ({
    'Accept': 'application/json',
    'Authorization': `Bearer ${secretKey}`,
});

const validateEnvironmentVariables = (requiredVars: string[]): void => {
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// ==================== AWS REKOGNITION SERVICES ====================

export const createLivenessSession = async (
    settings: LivenessSessionSettings = {}
): Promise<string> => {
    try {
        validateEnvironmentVariables(['S3_BUCKET']);
        
        const input = {
            Settings: {
                OutputConfig: {
                    S3Bucket: settings.outputBucket || process.env.S3_BUCKET,
                    S3KeyPrefix: settings.keyPrefix || process.env.S3_KEY_PREFIX,
                },
                AuditImagesLimit: settings.auditImagesLimit || DEFAULT_VALUES.AUDIT_IMAGES_LIMIT,
            },
        };

        const command = new CreateFaceLivenessSessionCommand(input);
        const response = await rekognitionClient.send(command);
        
        if (!response.SessionId) {
            throw new Error('Failed to create liveness session: No session ID returned');
        }
        
        return response.SessionId;
    } catch (error) {
        console.error('Error creating liveness session:', error);
        // throw error;
    }
};

export const getLivenessResults = async (sessionId: string) => {
    try {
        if (!sessionId) {
            throw new Error('Session ID is required');
        }

        const command = new GetFaceLivenessSessionResultsCommand({
            SessionId: sessionId,
        });
        
        const response = await rekognitionClient.send(command);
        return response;
    } catch (error) {
        console.error('Error getting liveness results:', error);
        // throw error;
    }
};

// ==================== VERIFICATION SERVICES ====================

export const getVerificationRetries = async (data: RetriesData): Promise<ServiceResult> => {
    const { projectId, userId, activity } = data;

    if (projectId !== SUPPORTED_PROJECTS.CATHOLIC_PAY) {
        return createErrorResponse(
            'Unsupported project ID', 
            null, 
            HTTP_STATUS.BAD_REQUEST
        );
    }

    try {
        validateEnvironmentVariables(['CATHOLICPAY_API_URL', 'CATHOLICPAY_SECRET_KEY']);

        const apiUrl = `${process.env.CATHOLICPAY_API_URL}/verification/retries`;
        const secretKey = process.env.CATHOLICPAY_SECRET_KEY!;

        const response = await axios.get<VerificationResponse>(apiUrl, {
            params: {
                user_id: userId,
                activity: activity ?? data.activity ?? DEFAULT_VALUES.INAPP_ACTIVITY,
            },
            headers: getAuthHeaders(secretKey),
        });

        return createSuccessResponse(
            'Retries returned successfully',
            response.data.data
        );

    } catch (error: any) {
        console.error('Error fetching verification retries:', error);
        
        return createErrorResponse(
            error.response?.data?.message || 'Failed to fetch retries',
            error.response?.data?.data || null,
            error.response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};

export const uploadVerificationData = async (
    data: VerificationData, 
    projectId: string
): Promise<ServiceResult | undefined> => {
    if (projectId !== SUPPORTED_PROJECTS.CATHOLIC_PAY) {
        return createErrorResponse(
            'Unsupported project ID', 
            null, 
            HTTP_STATUS.BAD_REQUEST
        );
    }

    try {
        validateEnvironmentVariables(['CATHOLICPAY_API_URL', 'CATHOLICPAY_SECRET_KEY']);

        const form = createFormData(data);
        const apiUrl = `${process.env.CATHOLICPAY_API_URL}/verification/save-liveness`;
        const secretKey = process.env.CATHOLICPAY_SECRET_KEY!;

        const response = await axios.post<VerificationUploadedResponse>(
            apiUrl, 
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    ...getAuthHeaders(secretKey),
                },
            }
        );

        console.log("Success: ", response);
        
        const responseData = response.data;
        
        return createSuccessResponse(
            responseData.message || 'Liveness uploaded successfully',
            responseData.data || null,
            response.status || HTTP_STATUS.OK
        );

    } catch (error: any) {  
        console.log("Error New: ", error.response);
        return createErrorResponse(
            error.response?.data?.message || 'Failed to save liveness',
            error.response?.data?.data || null,
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
};


const createFormData = (data: VerificationData): FormData => {
    const {
        user_id,
        session_id = DEFAULT_VALUES.SESSION_ID,
        activity = DEFAULT_VALUES.INAPP_ACTIVITY,
        audit_image_urls = [],
        confidence_level = '',
        retries = ''
    } = data;

    const form = new FormData();
    
    form.append('user_id', String(user_id));
    form.append('session_id', String(session_id));
    form.append('activity', String(activity));
    form.append('confidence_level', String(confidence_level));
    form.append('retries', String(retries));

    // Add audit image URLs if they exist
    audit_image_urls
        .filter(Boolean)
        .forEach((url: string) => {
            form.append('audit_image_urls[]', url);
        });

    return form;
};


export const createLivenessSessionService = createLivenessSession;
export const getLivenessResultsService = getLivenessResults;
export const verificationRetriesService = getVerificationRetries;
export const verificationUploadService = uploadVerificationData;