export interface TranslateRes {
	tSpeakUrl: string;
	requestId: string;
	query: string;
	translation: string[];
	errorCode: string;
	dict: Dict;
	webdict: Webdict;
	l: string;
	isWord: boolean;
	speakUrl: string;
}

export interface Dict {
	url: string;
}

export interface Webdict {
	url: string;
}