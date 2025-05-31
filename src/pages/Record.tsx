import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Record() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const navigate = useNavigate()

  const startRecording = async () => {
    try {
      setError(null) // Clear any previous errors
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioURL(URL.createObjectURL(blob))
      }

      mediaRecorder.current.start()
      setIsRecording(true)

      // Stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.current?.state === 'recording') {
          stopRecording()
        }
      }, 10000)
    } catch (err) {
      setIsRecording(false) // Reset recording state
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Microphone access was denied. Please grant permission to use your microphone.')
        } else if (err.name === 'NotFoundError') {
          setError('No microphone found. Please ensure a microphone is connected to your device.')
        } else {
          setError('An error occurred while accessing the microphone. Please try again.')
        }
      }
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    setIsRecording(false)
  }

  const handleSubmit = async () => {
    if (audioURL) {
      // TODO: Upload to Supabase and analyze
      navigate('/match')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Record Your Voice</h1>
        
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-full text-white font-semibold ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          {error && (
            <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {audioURL && (
            <div className="w-full space-y-4">
              <audio src={audioURL} controls className="w-full" />
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full"
              >
                Find My Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}