"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Mic, MicOff, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSuggestedReplies } from "@/utils/chat-suggestions"
import * as mammoth from "mammoth"
import { v4 as uuidv4 } from 'uuid'
import type React from "react"

// Extend Window interface to include lastMessageTime
declare global {
  interface Window {
    lastMessageTime?: number;
  }
}

interface Message {
  sender: string
  text: string
}

interface SuggestedResponse {
  text: string
}

interface EnhancedChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isWaitingForResponse: boolean
  currentQuestion: string
  userName?: string
  suggestedResponses?: SuggestedResponse[]
  onDocumentUpload?: (documentText: string, filename: string) => void
  legalCategory?: string
}

export function EnhancedChatInterface({
  messages,
  onSendMessage,
  isWaitingForResponse,
  currentQuestion,
  userName = "",
  suggestedResponses = [],
  onDocumentUpload,
  legalCategory,
}: EnhancedChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [rotatingSuggestions, setRotatingSuggestions] = useState<string[]>([])
  const [lastAssistantCount, setLastAssistantCount] = useState(0)
  
  // Master Suggested Response List
  const MASTER_SUGGESTED_RESPONSES = {
    // Default / Unknown Legal Issue (fallback options)
    default: [
      "I need help with a legal document",
      "I want to understand my legal options",
      "Can you explain what I should do?",
      "I'm not sure what to file."
    ],
    
    // Criminal Issues (incarcerated, charged, post-trial)
    criminal: [
      "I need help with a post-conviction motion.",
      "I want to challenge my conviction.",
      "I want to file a motion to reduce my sentence.",
      "I need help preparing for my criminal appeal."
    ],
    
    // Civil Rights or Prison Abuse (jail/prison-related complaints)
    civilRights: [
      "I want to file a civil suit against the prison.",
      "I was assaulted by a corrections officer.",
      "I need to report abuse or mistreatment in jail.",
      "I want to file a federal 1983 civil rights complaint."
    ],
    
    // Sentence Modification / Resentencing
    sentenceModification: [
      "I want to request a sentence reduction.",
      "I need help filing a resentencing motion.",
      "I want to correct my sentence or record.",
      "I'm eligible under new sentencing laws."
    ],
    
    // Appeals
    appeals: [
      "I want to appeal my conviction.",
      "I need help filing an appeal.",
      "What are my chances if I appeal?",
      "Help me write a notice of appeal."
    ],
    
    // Motions (Trial / Pre-trial / Dismissals)
    motions: [
      "I want to file a motion to dismiss.",
      "I need help with a motion to suppress evidence.",
      "I want to file a motion for discovery.",
      "I need help preparing for trial."
    ],
    
    // Civil (non-incarceration)
    civil: [
      "I need help with a wage claim.",
      "I want to sue my landlord.",
      "I'm responding to a court notice.",
      "I need help writing a legal letter."
    ]
  };

  // Function to detect legal issue type and return appropriate suggestions
  const detectLegalIssueAndGetSuggestions = (messages: Message[], category?: string): string[] => {
    // Add null check for messages
    if (!messages || messages.length === 0) {
      return MASTER_SUGGESTED_RESPONSES.default.slice(0, 4);
    }
    
    // Get recent user messages (last 3) for more focused detection
    const recentUserMessages = messages
      .filter(msg => msg.sender === "user")
      .slice(-3)
      .map(msg => msg.text.toLowerCase())
      .join(' ');
    
    // Criminal category detection
    if (category === 'criminal' || category === 'Criminal') {
      // Check for specific criminal issue types in recent messages
      if (recentUserMessages.includes('appeal') || recentUserMessages.includes('conviction') || recentUserMessages.includes('verdict') || recentUserMessages.includes('lost trial')) {
        return MASTER_SUGGESTED_RESPONSES.appeals.slice(0, 4);
      }
      if (recentUserMessages.includes('sentence') || recentUserMessages.includes('resentencing') || recentUserMessages.includes('reduction') || recentUserMessages.includes('time served')) {
        return MASTER_SUGGESTED_RESPONSES.sentenceModification.slice(0, 4);
      }
      if (recentUserMessages.includes('motion') || recentUserMessages.includes('dismiss') || recentUserMessages.includes('suppress') || recentUserMessages.includes('discovery') || recentUserMessages.includes('evidence')) {
        return MASTER_SUGGESTED_RESPONSES.motions.slice(0, 4);
      }
      if (recentUserMessages.includes('prison') || recentUserMessages.includes('jail') || recentUserMessages.includes('assault') || recentUserMessages.includes('abuse') || recentUserMessages.includes('mistreatment') || recentUserMessages.includes('guard') || recentUserMessages.includes('officer')) {
        return MASTER_SUGGESTED_RESPONSES.civilRights.slice(0, 4);
      }
      if (recentUserMessages.includes('charges') || recentUserMessages.includes('arrested') || recentUserMessages.includes('indicted') || recentUserMessages.includes('prosecution')) {
        return MASTER_SUGGESTED_RESPONSES.motions.slice(0, 4);
      }
      // Default criminal suggestions
      return MASTER_SUGGESTED_RESPONSES.criminal.slice(0, 4);
    }
    
    // Civil category detection
    if (category === 'civil' || category === 'Civil') {
      if (recentUserMessages.includes('wage') || recentUserMessages.includes('employment') || recentUserMessages.includes('pay') || recentUserMessages.includes('salary') || recentUserMessages.includes('overtime')) {
        return MASTER_SUGGESTED_RESPONSES.civil.slice(0, 4);
      }
      if (recentUserMessages.includes('landlord') || recentUserMessages.includes('tenant') || recentUserMessages.includes('eviction') || recentUserMessages.includes('rent') || recentUserMessages.includes('lease')) {
        return MASTER_SUGGESTED_RESPONSES.civil.slice(0, 4);
      }
      if (recentUserMessages.includes('discrimination') || recentUserMessages.includes('harassment') || recentUserMessages.includes('wrongful termination')) {
        return MASTER_SUGGESTED_RESPONSES.civil.slice(0, 4);
      }
      // Default civil suggestions
      return MASTER_SUGGESTED_RESPONSES.civil.slice(0, 4);
    }
    
    // General detection based on keywords in recent messages
    if (recentUserMessages.includes('appeal') || recentUserMessages.includes('conviction') || recentUserMessages.includes('trial') || recentUserMessages.includes('sentence') || recentUserMessages.includes('guilty') || recentUserMessages.includes('innocent')) {
      return MASTER_SUGGESTED_RESPONSES.criminal.slice(0, 4);
    }
    if (recentUserMessages.includes('prison') || recentUserMessages.includes('jail') || recentUserMessages.includes('assault') || recentUserMessages.includes('abuse') || recentUserMessages.includes('mistreatment') || recentUserMessages.includes('guard') || recentUserMessages.includes('officer')) {
      return MASTER_SUGGESTED_RESPONSES.civilRights.slice(0, 4);
    }
    if (recentUserMessages.includes('wage') || recentUserMessages.includes('landlord') || recentUserMessages.includes('tenant') || recentUserMessages.includes('employment') || recentUserMessages.includes('work') || recentUserMessages.includes('job')) {
      return MASTER_SUGGESTED_RESPONSES.civil.slice(0, 4);
    }
    if (recentUserMessages.includes('charges') || recentUserMessages.includes('arrested') || recentUserMessages.includes('indicted') || recentUserMessages.includes('prosecution') || recentUserMessages.includes('criminal')) {
      return MASTER_SUGGESTED_RESPONSES.criminal.slice(0, 4);
    }
    if (recentUserMessages.includes('motion') || recentUserMessages.includes('dismiss') || recentUserMessages.includes('suppress') || recentUserMessages.includes('discovery') || recentUserMessages.includes('evidence') || recentUserMessages.includes('court')) {
      return MASTER_SUGGESTED_RESPONSES.motions.slice(0, 4);
    }
    
    // Default fallback
    return MASTER_SUGGESTED_RESPONSES.default.slice(0, 4);
  };

  // PDF.js completely disabled to prevent object property errors
  useEffect(() => {
    setPdfjsLib(null);
    console.log('🚨 [PDF DEBUG] PDF.js disabled to prevent object property errors');
  }, []);

  // Emoji mapping for common legal suggestions
  const suggestionEmojiMap: Record<string, string> = {
    // Default suggestions
    "I need help with a legal document": "📄",
    "I want to understand my legal options": "⚖️",
    "Can you explain what I should do?": "🤔",
    "I'm not sure what to file.": "❓",
    
    // Criminal suggestions
    "I need help with a post-conviction motion.": "🔴",
    "I want to challenge my conviction.": "⚖️",
    "I want to file a motion to reduce my sentence.": "📝",
    "I need help preparing for my criminal appeal.": "📋",
    
    // Civil rights suggestions
    "I want to file a civil suit against the prison.": "🏛️",
    "I was assaulted by a corrections officer.": "🚨",
    "I need to report abuse or mistreatment in jail.": "⚠️",
    "I want to file a federal 1983 civil rights complaint.": "🇺🇸",
    
    // Sentence modification suggestions
    "I want to request a sentence reduction.": "📉",
    "I need help filing a resentencing motion.": "📄",
    "I want to correct my sentence or record.": "✏️",
    "I'm eligible under new sentencing laws.": "📜",
    
    // Appeals suggestions
    "I want to appeal my conviction.": "⬆️",
    "I need help filing an appeal.": "📋",
    "What are my chances if I appeal?": "🎯",
    "Help me write a notice of appeal.": "✍️",
    
    // Motions suggestions
    "I want to file a motion to dismiss.": "❌",
    "I need help with a motion to suppress evidence.": "🔒",
    "I want to file a motion for discovery.": "🔍",
    "I need help preparing for trial.": "⚖️",
    
    // Civil suggestions
    "I need help with a wage claim.": "💰",
    "I want to sue my landlord.": "🏠",
    "I'm responding to a court notice.": "📬",
    "I need help writing a legal letter.": "✉️",
    
    // Legacy mappings for backward compatibility
    "Yes, I have the eviction notice": "📄",
    "I can upload my lease agreement": "📁",
    "How much time do I have to respond?": "✍️",
  };

  // Check if speech recognition is supported
  useEffect(() => {
    const isSupported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    const isSecureContext = window.isSecureContext || location.protocol === 'https:'
    
    // Speech recognition requires HTTPS in most browsers
    const fullySupported = isSupported && isSecureContext
    
    setSpeechSupported(fullySupported)
    
    if (!isSupported) {
      console.warn("Speech recognition not supported in this browser")
    } else if (!isSecureContext) {
      console.warn("Speech recognition requires HTTPS connection")
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update suggestions when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      const aiMessages = messages.filter((msg) => msg.sender === "assistant")
      if (aiMessages.length > 0) {
        const lastPrompt = aiMessages[aiMessages.length - 1]?.text || ""
        const suggestions = getSuggestedReplies(lastPrompt)
        setDynamicSuggestions(suggestions)
      }
    }
  }, [messages])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Rotate suggestions when a new assistant message arrives
  useEffect(() => {
    if (!messages) return;
    const assistantCount = messages.filter((msg) => msg.sender === "assistant").length;
    if (assistantCount !== lastAssistantCount) {
      // Get issue-specific suggestions and show 3-4 of them
      const issueSpecificSuggestions = detectLegalIssueAndGetSuggestions(messages, legalCategory);
      const shuffled = [...issueSpecificSuggestions].sort(() => 0.5 - Math.random());
      setRotatingSuggestions(shuffled.slice(0, Math.min(4, shuffled.length)));
      setLastAssistantCount(assistantCount);
    }
  }, [messages, lastAssistantCount, legalCategory]);

  // Update suggestions more frequently based on conversation content
  useEffect(() => {
    // Update suggestions whenever messages change (not just assistant messages)
    if (messages && messages.length > 0) {
      const issueSpecificSuggestions = detectLegalIssueAndGetSuggestions(messages, legalCategory);
      const shuffled = [...issueSpecificSuggestions].sort(() => 0.5 - Math.random());
      setRotatingSuggestions(shuffled.slice(0, Math.min(4, shuffled.length)));
    }
  }, [messages, legalCategory]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      const maxHeight = 200; // Corresponds to roughly 6 lines
      if (scrollHeight > maxHeight) {
        inputRef.current.style.height = `${maxHeight}px`;
        inputRef.current.style.overflowY = 'auto';
      } else {
        inputRef.current.style.height = `${scrollHeight}px`;
        inputRef.current.style.overflowY = 'hidden';
      }
    }
  }, [inputValue]);

  const handleSendMessage = (message: string) => {
    // HARD-CODED SAFEGUARDS TO PREVENT DUPLICATE SUBMISSIONS
    if (!message || !message.trim()) {
      console.log("Empty message, not sending");
      return;
    }
    
    if (isWaitingForResponse) {
      console.log("Already waiting for response, not sending");
      return;
    }
    
    // Check if this is a duplicate of the last message
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.sender === "user" && lastMessage.text === message) {
        console.log("Duplicate message detected, not sending")
        return
      }
    }

    // Prevent rapid-fire submissions
    const now = Date.now();
    if (window.lastMessageTime && now - window.lastMessageTime < 1000) {
      console.log("Rapid-fire submission blocked");
      return;
    }
    window.lastMessageTime = now;

    console.log("✅ Sending message:", message.substring(0, 50) + "...");
    onSendMessage(message)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // HARD-CODED SAFEGUARDS
    if (!inputValue.trim()) {
      console.log("Empty input, not submitting");
      return;
    }
    
    if (isWaitingForResponse) {
      console.log("Already waiting for response, not submitting");
      return;
    }
    
    // Prevent rapid-fire submissions
    const now = Date.now();
    if (window.lastMessageTime && now - window.lastMessageTime < 1000) {
      console.log("Rapid-fire submission blocked in handleSubmit");
      return;
    }
    
    console.log("✅ Form submission:", inputValue.substring(0, 50) + "...");
    handleSendMessage(inputValue.trim())
    setInputValue("")
  }

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (!speechSupported) {
      const isSecureContext = window.isSecureContext || location.protocol === 'https:'
      if (!isSecureContext) {
        alert("Speech recognition requires HTTPS connection. Please access the site via https://askailegal.com")
      } else {
        alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
      }
      return
    }

    setIsListening(true)

    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputValue((prev) => prev + " " + transcript)
        console.log("Speech recognition result:", transcript)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        
        // Provide user-friendly error messages
        switch (event.error) {
          case 'not-allowed':
            alert("Microphone permission denied. Please allow microphone access and try again.")
            break
          case 'service-not-allowed':
            alert("Speech recognition service is not available. This may be due to:\n• Using HTTP instead of HTTPS\n• Browser security settings\n• Network restrictions\n\nPlease try using Chrome, Edge, or Safari on a secure connection.")
            break
          case 'no-speech':
            alert("No speech detected. Please try speaking again.")
            break
          case 'network':
            alert("Network error occurred. Please check your connection and try again.")
            break
          case 'aborted':
            alert("Speech recognition was interrupted. Please try again.")
            break
          case 'audio-capture':
            alert("No microphone found. Please check your microphone connection.")
            break
          case 'language-not-supported':
            alert("Language not supported. Please try again.")
            break
          default:
            alert(`Speech recognition failed: ${event.error}. Please try again.`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error("Failed to start speech recognition:", error)
      setIsListening(false)
      alert("Failed to start speech recognition. Please try again.")
    }
  }

  const stopListening = () => {
    setIsListening(false)
    // Speech recognition will auto-stop due to onend event
  }

  // Updated to populate the input field instead of sending immediately
  const handleSuggestedResponse = (text: string) => {
    setInputValue(text)
    // Focus the input field after setting the value
    inputRef.current?.focus()
  }

  // Handle file input change (support multiple files)
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🚨 [FILE INPUT DEBUG] File input change triggered');
    const files = event.target.files;
    console.log('🚨 [FILE INPUT DEBUG] Files selected:', files?.length || 0);
    
    // Prevent processing if already uploading
    if (isUploading) {
      console.log('🚨 [FILE INPUT DEBUG] Upload already in progress, ignoring file selection');
      return;
    }
    
    // Prevent processing if waiting for AI response
    if (isWaitingForResponse) {
      console.log('🚨 [FILE INPUT DEBUG] Waiting for AI response, ignoring file selection');
      return;
    }
    
    if (files && files.length > 0) {
      console.log('🚨 [FILE INPUT DEBUG] Processing files...');
      
      // Process files sequentially to avoid conflicts
      const processFiles = async () => {
        for (let i = 0; i < files.length; i++) {
          try {
            console.log(`🚨 [FILE INPUT DEBUG] Processing file ${i + 1}:`, files[i].name);
            await handleFileUpload(files[i]);
          } catch (error) {
            console.error(`🚨 [FILE INPUT DEBUG] Error processing file ${files[i].name}:`, error);
          }
        }
      };
      
      processFiles();
    } else {
      console.log('🚨 [FILE INPUT DEBUG] No files selected');
    }
    
    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };



    // Enhanced file upload handler with Step 3 parsing logic
  const handleFileUpload = useCallback(async (file: File) => {
    console.log('🚨 [UPLOAD DEBUG] Starting file upload process for:', file.name);
    setIsUploading(true);
    
    // Add a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      console.log('🚨 [UPLOAD DEBUG] Safety timeout triggered - resetting upload state');
      setIsUploading(false);
    }, 10000); // Reduced to 10 second timeout
    
    try {
      console.log('🚨 [UPLOAD DEBUG] Processing file:', file.name);
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileSize = file.size;
      
      // Simple file validation
      if (!file || fileSize === 0) {
        throw new Error('Invalid file selected');
      }
      
      // Check file size (limit to 20MB)
      if (fileSize > 20 * 1024 * 1024) {
        throw new Error('File size too large. Please select a file smaller than 20MB.');
      }
      
      // Check file type
      const allowedTypes = ['pdf', 'docx', 'txt'];
      if (!allowedTypes.includes(ext || '')) {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files only.');
      }
      
      console.log('🚨 [UPLOAD DEBUG] File validation passed');
      
      // Extract text content from the file
      let documentText = '';
      try {
        // Use the new extractText function
        const { extractText } = await import('@/utils/extractText');
        documentText = await extractText(file);
        console.log('🚨 [UPLOAD DEBUG] File text extracted, length:', documentText.length);
      } catch (textError) {
        console.error('🚨 [UPLOAD DEBUG] Error extracting text:', textError);
        documentText = `File: ${file.name}\n\nError extracting text content. File type: ${ext?.toUpperCase()}, Size: ${(fileSize / 1024).toFixed(1)}KB`;
      }
      
      // Create document data with extracted text
      const documentId = uuidv4();
      const documentData = {
        id: documentId,
        filename: file.name,
        fileType: ext,
        fileSize: fileSize,
        uploadTime: new Date().toISOString(),
        status: 'uploaded',
        content: documentText,
        parsedText: documentText
      };

      // Store in localStorage
      if (typeof window !== 'undefined') {
        try {
          let docs: any[] = [];
          try {
            docs = JSON.parse(localStorage.getItem('uploaded_documents') || '[]');
          } catch {
            docs = [];
          }
          docs.push(documentData);
          localStorage.setItem('uploaded_documents', JSON.stringify(docs));
          
          // Store basic file info for backward compatibility
          localStorage.setItem("uploaded_file_name", file.name);
          localStorage.setItem("uploaded_file_type", ext || 'unknown');
          localStorage.setItem("uploaded_file_size", fileSize.toString());
          localStorage.setItem("uploaded_parsed_text", documentText);
          localStorage.setItem("uploaded_text", documentText);
          
          // Use the new centralized function
          const { saveUploadedParsedText } = await import('@/lib/uploadedDoc');
          saveUploadedParsedText(documentText);
          
          console.log('🚨 [UPLOAD DEBUG] File data stored in localStorage');
        } catch (storageError) {
          console.error('🚨 [UPLOAD DEBUG] Error storing file data:', storageError);
          // Don't fail the upload if localStorage fails
        }
      }

      // Call the parent's document upload handler if available
      if (onDocumentUpload) {
        try {
          const fileInfo = `File: ${file.name} (${ext?.toUpperCase()}, ${(fileSize / 1024).toFixed(1)}KB)\n\nDocument Content:\n${documentText.substring(0, 500)}${documentText.length > 500 ? '...' : ''}`;
          onDocumentUpload(fileInfo, file.name);
          console.log('🚨 [UPLOAD DEBUG] Parent document upload handler called with content');
        } catch (parentError) {
          console.error('🚨 [UPLOAD DEBUG] Error calling parent upload handler:', parentError);
          // Don't fail the upload if parent handler fails
        }
      }

      console.log('🚨 [UPLOAD DEBUG] File processing completed successfully');
      
      // Send success message
      const successMessage = `✅ Document uploaded successfully: ${file.name}\n\nI've extracted the text content from your document and can now analyze it. I can:\n• Explain the document's legal implications\n• Answer questions about specific sections\n• Identify important deadlines or requirements\n• Help you understand your rights and options\n\nWhat would you like me to help you with regarding this document?`;
      if (handleSendMessage) {
        try {
          handleSendMessage(successMessage);
          console.log('🚨 [UPLOAD DEBUG] Success message sent');
        } catch (messageError) {
          console.error('🚨 [UPLOAD DEBUG] Error sending success message:', messageError);
          // Don't fail the upload if message sending fails
        }
      }
      
    } catch (error) {
      console.error('🚨 [UPLOAD DEBUG] Error processing file:', error);
      
      // Send error message to user
      const errorMessage = `❌ Upload failed: ${error.message || 'Unknown error occurred'}`;
      if (handleSendMessage) {
        try {
          handleSendMessage(errorMessage);
        } catch (messageError) {
          console.error('🚨 [UPLOAD DEBUG] Error sending error message:', messageError);
        }
      }
    } finally {
      console.log('🚨 [UPLOAD DEBUG] Cleaning up upload state');
      clearTimeout(safetyTimeout);
      setIsUploading(false);
    }
  }, [onDocumentUpload, handleSendMessage]);

  // Trigger file input click
  const handleUploadClick = () => {
    console.log('🚨 [UPLOAD BUTTON DEBUG] Upload button clicked');
    
    // Prevent multiple clicks while uploading
    if (isUploading) {
      console.log('🚨 [UPLOAD BUTTON DEBUG] Upload already in progress, ignoring click');
      return;
    }
    
    // Prevent upload while waiting for AI response
    if (isWaitingForResponse) {
      console.log('🚨 [UPLOAD BUTTON DEBUG] Waiting for AI response, ignoring click');
      return;
    }
    
    console.log('🚨 [UPLOAD BUTTON DEBUG] File input ref:', fileInputRef.current);
    
    if (fileInputRef.current) {
      try {
        // Reset the file input value to ensure the change event fires
        fileInputRef.current.value = '';
        fileInputRef.current.click();
        console.log('🚨 [UPLOAD BUTTON DEBUG] File input click triggered successfully');
      } catch (error) {
        console.error('🚨 [UPLOAD BUTTON DEBUG] Error triggering file input click:', error);
        // Reset upload state if there's an error
        setIsUploading(false);
      }
    } else {
      console.error('🚨 [UPLOAD BUTTON DEBUG] File input ref is null');
      // Reset upload state if file input is not found
      setIsUploading(false);
    }
  };

  // Manual reset function for stuck uploads
  const handleUploadReset = () => {
    console.log('🚨 [UPLOAD DEBUG] Manual reset triggered');
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use dynamic suggestions from the last AI message instead of the passed-in suggestions
  const displaySuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : (suggestedResponses || []).map((s) => s.text)

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages - Mobile-first with auto-scroll */}
      <div 
        className="flex-grow overflow-y-auto px-3 py-2 sm:px-4 sm:py-4 space-y-2 sm:space-y-3"
      >
        {(messages || []).map((message, index) => (
          <div key={index} className={`flex mt-2 mb-2 sm:mt-3 sm:mb-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 sm:p-4 text-sm sm:text-base ${
                message.sender === "user"
                  ? "bg-emerald-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.sender === "assistant" && (
                <div className="flex items-center mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mr-2">
                    K
                  </div>
                  <span className="text-xs font-medium text-emerald-700">Khristian</span>
                </div>
              )}
              {message.sender === "user" && userName && (
                <div className="flex items-center justify-end mb-1">
                  <span className="text-xs font-medium text-white mr-2">{userName}</span>
                  <div className="w-5 h-5 rounded-full bg-white text-emerald-500 flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator when waiting for response */}
        {isWaitingForResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Upload loading indicator */}
        {isUploading && (
          <div className="flex justify-start">
            <div className="bg-blue-100 rounded-lg p-3 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-sm text-blue-700">Processing document...</span>
              </div>
            </div>
          </div>
        )}

        {/* Invisible element for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Mobile-first with iOS viewport fixes */}
      <div className="border-t px-3 py-2 sm:p-3 pb-[max(14px,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="flex items-start space-x-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            multiple
          />
          
          {/* Upload button */}
          <Button
            type="button"
            size="icon"
            onClick={handleUploadClick}
            onDoubleClick={handleUploadReset}
            className="rounded-full shadow-md h-9 w-9 sm:h-10 sm:w-10 bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={false}
            title={isUploading ? "Double-click to reset if stuck" : "Upload document"}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={currentQuestion ? "Type your answer..." : "Type a message..."}
            className="flex-grow border rounded-2xl px-3 py-2 sm:px-4 sm:py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none overflow-hidden"
            disabled={isWaitingForResponse || isUploading}
            rows={1}
            style={{
              maxHeight: '12rem', // approx 6 lines
              minHeight: '2.5rem', // initial height
            }}
          />
          {speechSupported ? (
            <Button
              type="button"
              size="icon"
              onClick={toggleSpeechRecognition}
              className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 ${
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
              disabled={isWaitingForResponse || isUploading}
              title={isListening ? "Stop recording" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              className="rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-gray-400 cursor-not-allowed"
              disabled
              title="Voice input not supported in this browser"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white h-9 w-9 sm:h-10 sm:w-10"
            disabled={isWaitingForResponse || !inputValue.trim() || isUploading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Rotating Suggested Responses - Mobile-first */}
        {rotatingSuggestions.length > 0 && (
          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Suggested responses:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {rotatingSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedResponse(suggestion)}
                  className="px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-100 text-emerald-800 rounded-full font-medium text-xs sm:text-sm hover:bg-emerald-200 transition flex items-center gap-1"
                >
                  <span>{suggestionEmojiMap[suggestion] || null}</span>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
