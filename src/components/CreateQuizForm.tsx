import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Loader2, ArrowLeft } from 'lucide-react';
import { QuizConfig, Question, Difficulty } from '../App';

interface CreateQuizFormProps {
  onGenerateQuiz: (config: QuizConfig, questions: Question[]) => void;
  isLoading: boolean;
  onBack: () => void;
}

export function CreateQuizForm({ onGenerateQuiz, isLoading, onBack }: CreateQuizFormProps) {
  const [formData, setFormData] = useState({
    courseName: '',
    courseDescription: '',
    numberOfQuestions: '5',
    includeVideo: false,
    difficultyLevel: 'medium' as Difficulty,
    category: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 0.6,
        ease: 'back.out(1.7)',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.courseName || !formData.category) {
      alert('Please fill in Course Name and Category');
      return;
    }

    setIsGenerating(true);

    try {
      const config: QuizConfig = {
        courseName: formData.courseName,
        courseDescription: formData.courseDescription,
        numberOfQuestions: parseInt(formData.numberOfQuestions) || 5,
        includeVideo: formData.includeVideo,
        difficultyLevel: formData.difficultyLevel,
        category: formData.category,
      };

      // Generate quiz questions
      const questions = await generateQuestions(config);
      onGenerateQuiz(config, questions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateQuestions = async (config: QuizConfig): Promise<Question[]> => {
    // Using mock questions for now
    // To enable API integration, replace 'YOUR_API_KEY_HERE' with your actual Gemini API key
    
    const apiKey = 'AIzaSyAezHHzqnT-UfYVFFZnK3_50vlgzGU4WZA'; // Replace with your actual API key
    const useAPI = apiKey !== 'YOUR_API_KEY_HERE'; // Only use API if key is set
    
    if (!useAPI) {
      // Use mock questions directly when no API key is configured
      return generateMockQuestions(config);
    }
    
    try {
      const prompt = `Generate ${config.numberOfQuestions} multiple-choice quiz questions about ${config.category} for a course titled "${config.courseName}". 
Difficulty level: ${config.difficultyLevel}
${config.courseDescription ? `Course description: ${config.courseDescription}` : ''}

IMPORTANT: Return ONLY a valid JSON array with this exact structure (no additional text before or after):

[
  {
    "question": "Question text here?",
    "options": [
      { "text": "Option A text", "points": 1, "isCorrect": true },
      { "text": "Option B text", "points": 0.5, "isCorrect": false },
      { "text": "Option C text", "points": 0, "isCorrect": false },
      { "text": "Option D text", "points": 0, "isCorrect": false }
    ]
  }
]

Rules:
- Exactly ONE option should have "points": 1 and "isCorrect": true (this is the fully correct answer)
- You can have 0-2 options with "points": 0.5 (partially correct answers)
- Remaining options should have "points": 0 and "isCorrect": false
- Return ONLY the JSON array, no markdown code blocks, no explanations`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error Response:', errorData);
        throw new Error(`API returned ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('API Response:', generatedText);
      
      // Parse the generated text to extract questions
      const questions = parseAPIResponse(generatedText, config);
      return questions;
      
    } catch (error) {
      console.error('Error calling external API:', error);
      console.log('Falling back to mock questions...');
      // Fallback to mock questions if API fails
      return generateMockQuestions(config);
    }
  };

  const parseAPIResponse = (text: string, config: QuizConfig): Question[] => {
    // Try to extract JSON from the response
    try {
      // Remove markdown code blocks if present
      let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to find JSON array
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed questions:', parsed);
        
        const questions = parsed.map((q: any, index: number) => {
          const options = q.options.map((opt: any) => ({
            text: opt.text || opt,
            points: opt.points !== undefined ? opt.points : (opt.isCorrect ? 1 : 0),
          }));
          
          // Find which option is correct for tracking
          const correctIndex = options.findIndex((opt: any) => opt.points === 1);
          
          return {
            id: index + 1,
            text: q.question || q.text,
            category: config.category,
            options: options,
            correctAnswer: correctIndex >= 0 ? correctIndex : undefined,
          };
        });
        
        console.log('Final questions:', questions);
        return questions;
      }
    } catch (e) {
      console.error('Failed to parse API response:', e);
    }
    
    console.log('Falling back to mock questions due to parse error');
    return generateMockQuestions(config);
  };

  const generateMockQuestions = (config: QuizConfig): Question[] => {
    const questions: Question[] = [];
    const category = config.category;
    
    const sampleQuestions = [
      {
        template: `What is the most fundamental concept in ${category}?`,
        correct: `The core principle of ${category}`,
        partial: `A related but not central concept`,
        wrong1: `An unrelated topic`,
        wrong2: `A common misconception`,
      },
      {
        template: `Which of the following best describes ${category}?`,
        correct: `The accurate definition`,
        partial: `A partially correct description`,
        wrong1: `An incorrect interpretation`,
        wrong2: `A misleading answer`,
      },
      {
        template: `In ${category}, what is the primary goal?`,
        correct: `The main objective`,
        partial: `A secondary objective`,
        wrong1: `An unrelated goal`,
        wrong2: `A contradictory goal`,
      },
    ];
    
    for (let i = 0; i < config.numberOfQuestions; i++) {
      const template = sampleQuestions[i % sampleQuestions.length];
      questions.push({
        id: i + 1,
        text: template.template,
        category: category,
        options: [
          { text: template.correct, points: 1 },
          { text: template.partial, points: 0.5 },
          { text: template.wrong1, points: 0 },
          { text: template.wrong2, points: 0 },
        ],
        correctAnswer: 0, // First option is always correct in mock
      });
    }
    
    return questions;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div ref={formRef} className="max-w-2xl w-full bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-700 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-400" />
              </button>
              <h2 className="text-white">Create New Quiz</h2>
            </div>
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Name */}
            <div>
              <label className="text-gray-300 block mb-2">Course Name</label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="Course Name"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {/* Course Description */}
            <div>
              <label className="text-gray-300 block mb-2">Course Description (Optional)</label>
              <textarea
                value={formData.courseDescription}
                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                placeholder="Course Description"
                rows={3}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Number of Questions */}
            <div>
              <label className="text-gray-300 block mb-2">No. of Questions</label>
              <input
                type="number"
                value={formData.numberOfQuestions}
                onChange={(e) => setFormData({ ...formData, numberOfQuestions: e.target.value })}
                placeholder="No of chapters"
                min="1"
                max="20"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-gray-300 block mb-2">Difficulty Level</label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as Difficulty })}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="basic">Basic</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-300 block mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category (Separated by Comma)"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || isLoading}
              className="w-full py-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isGenerating || isLoading ? 'linear-gradient(135deg, #6B46C1, #4F46E5)' : 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                boxShadow: isGenerating || isLoading ? '0 10px 30px rgba(107, 70, 193, 0.3)' : '0 10px 30px rgba(139, 92, 246, 0.5)',
              }}
            >
              {isGenerating || isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Generate Quiz
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Sparkles icon component
function Sparkles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L13.5 7.5L18 9L13.5 10.5L12 15L10.5 10.5L6 9L10.5 7.5L12 3Z" fill="currentColor"/>
      <path d="M19 12L19.75 14.25L22 15L19.75 15.75L19 18L18.25 15.75L16 15L18.25 14.25L19 12Z" fill="currentColor"/>
      <path d="M5 17L5.75 19.25L8 20L5.75 20.75L5 23L4.25 20.75L2 20L4.25 19.25L5 17Z" fill="currentColor"/>
    </svg>
  );
}