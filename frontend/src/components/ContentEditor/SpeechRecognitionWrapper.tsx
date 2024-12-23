import { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Import the hook directly
import SpeechRecognition, { useSpeechRecognition as useSpeechRecognitionHook } from 'react-speech-recognition';

interface SpeechRecognitionWrapperProps {
  onTranscriptChange: (transcript: string) => void;
}

const SpeechRecognitionWrapper = ({ onTranscriptChange }: SpeechRecognitionWrapperProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognitionHook();  // Remove the configuration object

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (!browserSupportsSpeechRecognition) return null;

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      onTranscriptChange(transcript);
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
  };

  return (
    <Tooltip label={isRecording ? 'Stop Recording' : 'Start Recording'}>
      <IconButton
        aria-label="Voice Input"
        icon={isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
        onClick={handleVoiceInput}
        colorScheme={isRecording ? 'red' : 'gray'}
      />
    </Tooltip>
  );
};

// Export with no SSR
export default dynamic(() => Promise.resolve(SpeechRecognitionWrapper), {
  ssr: false
}); 