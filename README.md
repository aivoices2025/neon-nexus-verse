# 🌐 Learning Metaverse Platform

A comprehensive immersive learning platform that combines VR experiences, interactive labs, and collaborative education in a virtual metaverse environment.

## ✨ Features

### 🏛️ Metaverse Hub
- **3D Learning Environments**: Explore floating islands representing different subjects
- **Interactive Zones**: Code Academy, Science Lab, Team Spaces, Game Studio, Presentation Hall
- **VR Navigation**: Full WebXR support for immersive exploration
- **Real-time Collaboration**: Meet and learn with students worldwide

### 📚 Personalized Learning Paths
- **Structured Curricula**: Web Development, Data Science, AI, and more
- **Progress Tracking**: Visual progress indicators and achievement systems
- **Adaptive Difficulty**: Beginner to Advanced pathways
- **VR Learning Modules**: Experience concepts in 3D space

### 🧪 Interactive Laboratory
- **Coding Challenges**: Real-time code execution with 3D visualization
- **Virtual Experiments**: Physics, chemistry, and biology simulations
- **Collaborative Sessions**: Work together on projects in shared virtual spaces
- **Live Feedback**: Instant results and peer review systems

### 🎓 Virtual Classroom
- **Live Sessions**: Attend lectures in immersive VR environments
- **Interactive Whiteboard**: Collaborative drawing and note-taking
- **360° Content**: Experience lessons through 360° video
- **Student Management**: Track attendance and participation

### 👥 Social Learning
- **Avatar System**: Personalized 3D avatars for virtual interaction
- **Study Groups**: Form teams and collaborate on projects
- **Peer Learning**: Mentoring and knowledge sharing
- **Global Community**: Connect with learners worldwide

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js, React Three Fiber
- **VR Support**: WebXR API for headset compatibility
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM

## 🎯 Learning Experiences

### Code Academy
- **3D Code Visualization**: See your code come to life in 3D space
- **Interactive Challenges**: Gamified programming exercises
- **Real-time Collaboration**: Pair programming in VR
- **Multiple Languages**: JavaScript, Python, Java, and more

### Science Laboratory
- **Physics Simulations**: Gravity, pendulum motion, wave mechanics
- **Chemistry Experiments**: Molecular interactions and reactions
- **Biology Models**: 3D cell structures and biological processes
- **Mathematical Visualizations**: Geometric concepts in 3D

### Virtual Workshops
- **Live Coding Sessions**: Follow along with expert instructors
- **Interactive Presentations**: Engage with 3D models and diagrams
- **Q&A Sessions**: Real-time interaction with speakers
- **Recording Playback**: Review sessions in VR

## 🥽 VR Compatibility

### Supported Devices
- **VR Headsets**: Meta Quest 2/3, Pico 4, HTC Vive, Valve Index
- **Desktop**: Chrome, Firefox, Edge with WebXR support
- **Mobile**: iOS Safari, Android Chrome for 360° content

### VR Features
- **Hand Tracking**: Natural interaction with virtual objects
- **Spatial Audio**: Immersive 3D sound positioning
- **Room-scale Movement**: Walk around virtual environments
- **Cross-platform**: Seamless experience across devices

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- VR headset (optional but recommended)

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd learning-metaverse
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment setup**:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start development server**:
```bash
npm run dev
```

5. **Access the platform**:
   - Desktop: `http://localhost:5173`
   - VR: Put on your headset and navigate to the URL

## 📁 Project Structure

```
src/
├── components/
│   ├── MetaverseHub.tsx      # Main 3D learning hub
│   ├── LearningPath.tsx      # Structured learning journeys
│   ├── InteractiveLab.tsx    # Coding and experiment lab
│   ├── Classroom.tsx         # Virtual classroom environment
│   ├── VRAvatarSystem.tsx    # 3D avatar management
│   ├── Video360Viewer.tsx    # 360° video player
│   └── ui/                   # Reusable UI components
├── hooks/                    # Custom React hooks
├── integrations/            # Supabase integration
├── lib/                     # Utility functions
├── pages/                   # Main application pages
└── main.tsx                 # Application entry point
```

## 🎮 Key Components

### MetaverseHub
- 3D floating islands for different subjects
- Interactive zone selection
- Real-time student presence
- VR navigation controls

### LearningPath
- Structured module progression
- Achievement tracking
- Difficulty adaptation
- Social learning features

### InteractiveLab
- Code editor with 3D visualization
- Virtual science experiments
- Collaborative workspaces
- Real-time feedback systems

### VRAvatarSystem
- Customizable 3D avatars
- Spatial positioning
- Animation and gestures
- Cross-platform compatibility

## 🌟 Educational Benefits

### Immersive Learning
- **Enhanced Retention**: 3D visualization improves memory
- **Spatial Understanding**: Complex concepts in 3D space
- **Engagement**: Gamified learning experiences
- **Accessibility**: Multiple learning modalities

### Collaborative Education
- **Global Classroom**: Connect students worldwide
- **Peer Learning**: Learn from and teach others
- **Cultural Exchange**: Diverse perspectives and experiences
- **Social Skills**: Communication in virtual environments

### Personalized Experience
- **Adaptive Pathways**: Content adjusts to learning pace
- **Multiple Intelligences**: Visual, auditory, kinesthetic learning
- **Progress Tracking**: Detailed analytics and insights
- **Achievement Systems**: Motivation through gamification

## 🔧 Development

### Adding New Learning Modules
1. Create component in `src/components/`
2. Add to learning path configuration
3. Implement 3D visualization
4. Add progress tracking

### VR Optimization
- Use efficient 3D models
- Implement level-of-detail (LOD)
- Optimize for 90fps rendering
- Test across different headsets

### Collaboration Features
- Real-time synchronization
- Conflict resolution
- User presence indicators
- Voice chat integration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### VR Considerations
- HTTPS required for WebXR
- Optimize bundle size
- Enable compression
- Configure CORS headers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Areas for Contribution
- New learning modules
- VR interaction improvements
- Accessibility features
- Performance optimizations
- Educational content

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for 3D graphics
- WebXR working group for VR standards
- Educational technology researchers
- Open source contributors

---

**Ready to revolutionize education in the metaverse? Put on your headset and start learning! 🚀**