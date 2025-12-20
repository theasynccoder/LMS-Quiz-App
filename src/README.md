# AI-Powered Quiz Generator for LMS

A cutting-edge, immersive quiz application integrated with Learning Management Systems (LMS) featuring AI-generated questions powered by Google Gemini API, interactive 3D elements using Three.js, and smooth GSAP animations.

## 🎓 LMS Integration Features

### Core Workflow
1. **Create Quiz Button**: Landing page with a prominent "Create Quiz with AI" button
2. **AI Quiz Generation Form**: Dynamic form to configure quiz parameters
3. **Gemini API Integration**: Automatically generates questions based on user input
4. **Interactive Quiz Interface**: 3D-enhanced quiz taking experience
5. **Detailed Results**: Comprehensive performance analytics with export functionality

### Form Fields (Matching LMS Requirements)
- **Course Name**: Subject or topic for the quiz
- **Course Description** (Optional): Additional context for better question generation
- **Number of Questions**: Configurable question count (1-20)
- **Include Video Toggle**: Option to include video-based questions
- **Difficulty Level**: Basic, Medium, or Hard
- **Category**: Subject categorization (supports comma-separated values)

## 🤖 Gemini API Integration

### Setup Instructions

1. **Get Your API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key for Gemini API

2. **Configure API Key**:
   - Open `/components/CreateQuizForm.tsx`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key:
   ```typescript
   const apiKey = 'YOUR_GEMINI_API_KEY';
   ```

3. **API Endpoint**:
   ```
   https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
   ```

### How It Works
1. User fills out the quiz creation form
2. Form data is sent to Gemini API with a structured prompt
3. AI generates contextually relevant questions with multiple-choice answers
4. Questions include partial scoring options (0, 0.5, 1 point)
5. Generated quiz is immediately ready to take

### Fallback Mechanism
If the Gemini API is unavailable or fails:
- Automatic fallback to mock questions
- Maintains app functionality
- Clear error messaging

## 🎮 Quiz Features

### Partial Scoring System
- **1.0 points**: Fully correct answer
- **0.5 points**: Partially correct answer
- **0.0 points**: Incorrect answer

### Real-Time Score Tracking
- Live score display in header
- Animated score updates with particle effects
- Progress ring showing completion percentage
- Answered question counter

### Navigation Controls
- **Previous Button**: Review and change previous answers
- **Next Button**: Move to next question
- **Submit Button**: Appears on last question (only when all answered)
- Visual indicators for answered/unanswered questions

### Results Analytics
- Overall score and percentage
- Performance grading (Outstanding, Excellent, Good, Keep Practicing)
- Detailed breakdown:
  - Correct answers count
  - Partial credit answers count
  - Incorrect answers count
- Export results as JSON

## 🎨 3D Visual Elements

### Difficulty-Based Environments
- **Basic**: Simple geometric shapes with blue particles
- **Medium**: Torus shapes with orange/gold theme
- **Hard**: Complex octahedrons with red/pink dramatic lighting

### Interactive Elements
- Floating 3D platforms
- Dynamic particle systems (150-300 particles)
- Rotating background elements
- 3D trophy on results screen
- Particle explosion effects

### GSAP Animations
- Smooth screen transitions
- Score counting animations
- Progress bar fills
- Card entrance/exit effects
- Hover state parallax

## 📊 LMS-Specific Features

### Export Functionality
Results can be exported as JSON containing:
- Course information
- Score and percentage
- Performance metrics
- Timestamp
- Detailed answer breakdown

### Reusable Components
The quiz generator can be integrated into existing LMS platforms:
```typescript
import App from './App';

// In your LMS component
<App />
```

### State Management
Clean state handling for:
- Quiz configuration
- Question data
- User answers
- Score calculation
- Screen navigation

## 🛠️ Technical Stack

- **React + TypeScript**: Type-safe UI components
- **Three.js & React Three Fiber**: 3D rendering
- **@react-three/drei**: 3D helpers and controls
- **GSAP**: Professional animations
- **Gemini API**: AI question generation
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icons

## 📁 Project Structure

```
/
├── App.tsx                          # Main app with state management
├── components/
│   ├── LandingPage.tsx              # Entry point with "Create Quiz" button
│   ├── CreateQuizForm.tsx           # AI quiz generation form
│   ├── QuizInterface.tsx            # Quiz taking interface
│   ├── ResultsScreen.tsx            # Results with detailed analytics
│   ├── ProgressRing.tsx             # Circular progress indicator
│   ├── ScoreCounter.tsx             # Animated score display
│   ├── QuestionCard.tsx             # Question and answer cards
│   └── 3D/
│       ├── CategoryPlatform.tsx     # 3D shapes per difficulty
│       ├── ParticleField.tsx        # Floating particles
│       ├── QuizBackground.tsx       # Dynamic 3D backgrounds
│       ├── Trophy3D.tsx             # 3D trophy model
│       └── ParticleExplosion.tsx    # Celebration effects
└── styles/
    └── globals.css                  # Global styles and animations
```

## 🚀 Getting Started

### For LMS Integration:

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Configure Gemini API**:
   - Add your API key in `CreateQuizForm.tsx`

3. **Start Application**:
   - The app automatically opens on the landing page
   - Click "Create Quiz with AI" to begin

4. **Create Quiz**:
   - Fill in course details
   - Select difficulty level
   - Click "Generate Button"
   - AI generates questions instantly

5. **Take Quiz**:
   - Navigate through questions
   - Select answers (can review/change)
   - Submit when all answered

6. **View Results**:
   - See detailed performance analytics
   - Export results for LMS records
   - Create new quiz or edit settings

## 🎯 LMS Administrator Guide

### Customization Options

**Colors**: Modify difficulty colors in `App.tsx`:
```typescript
const difficultyColors = {
  basic: { primary: '#3B82F6', secondary: '#10B981' },
  medium: { primary: '#F59E0B', secondary: '#F97316' },
  hard: { primary: '#EF4444', secondary: '#EC4899' },
};
```

**Question Count**: Adjust in form validation (line 119 in `CreateQuizForm.tsx`):
```typescript
max="20" // Change to desired max
```

**API Configuration**: Replace mock fallback with your LMS API endpoint

### Data Export Format
```json
{
  "courseName": "React Fundamentals",
  "category": "Web Development",
  "difficulty": "medium",
  "totalQuestions": 5,
  "score": 4.5,
  "percentage": "90.0",
  "correctAnswers": 4,
  "partialAnswers": 1,
  "incorrectAnswers": 0,
  "performance": "Outstanding!"
}
```

## 🔐 Security Considerations

- Store API keys in environment variables (not hardcoded)
- Implement server-side API calls for production
- Validate user inputs before API calls
- Rate limit API requests
- Sanitize AI-generated content

## 📱 Responsive Design

- Fully responsive for desktop and mobile
- Touch-friendly navigation
- Simplified 3D rendering on mobile
- Adaptive layouts for all screen sizes

## 🎨 Customization for Your LMS

### Branding
- Update colors to match your LMS theme
- Replace icons with your custom icons
- Modify typography in `globals.css`

### Integration Points
- **User Authentication**: Add user context from LMS
- **Progress Saving**: Connect to LMS database
- **Gradebook Integration**: Auto-submit scores
- **Course Linking**: Connect to course catalog

## 🔄 Future Enhancements

- [ ] Multi-language support
- [ ] Question bank management
- [ ] Video question support
- [ ] Image-based questions
- [ ] Timed quizzes with countdown
- [ ] Leaderboard integration
- [ ] Social sharing features
- [ ] Accessibility improvements (WCAG compliance)

## 📞 Support

For LMS integration support or custom features:
- Document all API requirements
- Provide sample data formats
- Share branding guidelines
- Specify integration endpoints

## 🌟 Key Differentiators

✅ **AI-Powered**: Automatic question generation using Google Gemini
✅ **3D Immersive**: Unique visual experience with Three.js
✅ **Partial Scoring**: Nuanced grading system
✅ **Full Navigation**: Review and change answers anytime
✅ **Export Ready**: JSON export for LMS integration
✅ **Mobile Friendly**: Responsive design for all devices
✅ **Performance Optimized**: Fast rendering with LOD techniques

---

**Perfect for**: Educational institutions, corporate training platforms, online course providers, and any LMS requiring engaging, AI-generated assessments.
