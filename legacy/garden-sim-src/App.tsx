import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { GardenTerrain } from './components/3d/GardenTerrain';
import { GardenLivingElements } from './components/3d/GardenLife';
import { SkippiStall } from './components/3d/SkippiStall';
import { SalespersonRavi } from './components/3d/SalespersonRavi';
import { CustomerCharacter } from './components/3d/CustomerCharacter';
import { CameraRig } from './components/3d/CameraRig';
import { TopHUD } from './components/ui/TopHUD';
import { DialogueBox } from './components/ui/DialogueBox';
import { ProductSelector } from './components/ui/ProductSelector';
import { CelebrationBanner } from './components/ui/CelebrationBanner';
import { SharkTankEvaluationModal } from './components/ui/SharkTankEvaluationModal';
import { BusinessHubModal } from './components/ui/BusinessHubModal';
import { ControlsGuide } from './components/ui/ControlsGuide';
import { CUSTOMER_QUEUE } from './data/skippiData';
import { 
  CustomerLifecycle, 
  CameraViewMode, 
  GameStats, 
  DialogueChoice, 
  IcePop 
} from './types/game';
import { sounds } from './audio/soundEffects';

export function App() {
  // Game progress and queue
  const [customerIndex, setCustomerIndex] = useState<number>(0);
  const [lifecycle, setLifecycle] = useState<CustomerLifecycle>('walking_to_stall');
  const [selectedPopColor, setSelectedPopColor] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IcePop | null>(null);

  // Camera & presentation
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('stall_counter');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSharkModal, setShowSharkModal] = useState<boolean>(false);
  const [showBusinessHub, setShowBusinessHub] = useState<boolean>(false);

  // Business statistics & learning progress
  const [stats, setStats] = useState<GameStats>({
    revenue: 0,
    customersServed: 0,
    productsSold: 0,
    satisfactionScore: 100,
    xp: 0,
    unlockedBadges: [],
    mistakesCount: 0
  });

  const currentCustomer = CUSTOMER_QUEUE[customerIndex] || CUSTOMER_QUEUE[0];
  const isLastCustomer = customerIndex === CUSTOMER_QUEUE.length - 1;

  // Sound manager sync
  useEffect(() => {
    sounds.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Fullscreen helper
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // 1. Customer Arrives at Counter
  const handleArrivedAtCounter = useCallback(() => {
    setLifecycle('greeting');
    sounds.playBell();

    // Short greeting gesture before dialogue box appears
    setTimeout(() => {
      setLifecycle('dialogue');
      sounds.playPop();
    }, 1200);
  }, []);

  // 2. Player picks dialogue response
  const handleDialogueChoice = (choice: DialogueChoice) => {
    setStats((prev) => {
      const newSat = Math.max(0, Math.min(100, prev.satisfactionScore + choice.satisfactionDelta));
      const newMistakes = choice.isCorrect ? prev.mistakesCount : prev.mistakesCount + 1;
      return {
        ...prev,
        satisfactionScore: newSat,
        mistakesCount: newMistakes
      };
    });
  };

  // 3. Move to Product Selection & Handover
  const handleProceedToProduct = () => {
    setLifecycle('selecting_product');
  };

  // 4. Product Handover Sequence
  const handleProductHandover = (product: IcePop) => {
    setSelectedProduct(product);
    setSelectedPopColor(product.colorHex);
    setLifecycle('handover');

    // After physical handover animation reaches customer (1.4s), trigger celebration!
    setTimeout(() => {
      setLifecycle('celebrating');
      sounds.playCheer();

      // Confetti burst for successful sale
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#e11d48', '#eab308', '#0284c7', '#22c55e', '#a855f7']
      });

      // Update financial & learning stats
      setStats((prev) => {
        const badges = [...prev.unlockedBadges];
        if (currentCustomer.badgeUnlock && !badges.includes(currentCustomer.badgeUnlock)) {
          badges.push(currentCustomer.badgeUnlock);
        }
        return {
          ...prev,
          revenue: prev.revenue + product.price,
          productsSold: prev.productsSold + (product.isPack ? 12 : 1),
          customersServed: prev.customersServed + 1,
          xp: prev.xp + currentCustomer.rewardXp,
          unlockedBadges: badges
        };
      });
    }, 1400);
  };

  // 5. Customer finishes celebration & walks away
  const handleNextCustomer = () => {
    setLifecycle('walking_away');
  };

  // 6. When customer reaches exit, spawn next or open final Shark Tank summary
  const handleCustomerDeparted = () => {
    if (isLastCustomer) {
      setShowSharkModal(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    } else {
      setCustomerIndex((prev) => prev + 1);
      setSelectedPopColor(null);
      setSelectedProduct(null);
      setLifecycle('walking_to_stall');
    }
  };

  // Restart simulation
  const handleRestart = () => {
    setCustomerIndex(0);
    setLifecycle('walking_to_stall');
    setSelectedPopColor(null);
    setSelectedProduct(null);
    setShowSharkModal(false);
    setStats({
      revenue: 0,
      customersServed: 0,
      productsSold: 0,
      satisfactionScore: 100,
      xp: 0,
      unlockedBadges: [],
      mistakesCount: 0
    });
  };

  // Compute live objective string
  const currentObjectiveText = 
    lifecycle === 'walking_to_stall'
      ? `A new customer is approaching the garden stall: ${currentCustomer.name}`
      : lifecycle === 'greeting' || lifecycle === 'dialogue'
      ? `Address ${currentCustomer.name}'s query regarding ${currentCustomer.curriculumTopic.split(':')[0]}`
      : lifecycle === 'selecting_product'
      ? `Pick the ideal Skippi product for ${currentCustomer.name} from the stall counter`
      : lifecycle === 'handover'
      ? `Delivering fresh hygienic Skippi Ice Pop over the counter...`
      : `Customer is delighted! Review the sale and welcome the next visitor`;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-200">
      {/* 3D WebGL Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [1.8, 2.15, 4.6], fov: 46 }}
        gl={{ 
          antialias: true, 
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.18
        }}
        className="w-full h-full"
      >
        {/* Soft Radiant Summer Sky & Horizon Fog */}
        <color attach="background" args={['#7dd3fc']} />
        <fog attach="fog" args={['#bae6fd', 24, 60]} />

        {/* Ambient Warm Summer Illumination */}
        <ambientLight intensity={0.65} color="#fef9c3" />
        <hemisphereLight args={['#7dd3fc', '#4ade80', 0.55]} />

        {/* Warm Golden Sun Directional Light with Soft Shadows */}
        <directionalLight
          position={[14, 22, 12]}
          intensity={1.45}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-18}
          shadow-camera-right={18}
          shadow-camera-top={18}
          shadow-camera-bottom={-18}
          shadow-bias={-0.0002}
          color="#fffbeb"
        />

        {/* Soft Cool Sky Fill Light */}
        <directionalLight position={[-10, 8, -6]} intensity={0.4} color="#93c5fd" />

        {/* Warm Spotlight on Counter & Salesperson */}
        <pointLight position={[0, 2.4, 0.8]} intensity={0.65} color="#fef08a" distance={5} />

        {/* Detailed Living Garden World */}
        <GardenTerrain />

        {/* Living Butterflies, Pollen & Background Visitors */}
        <GardenLivingElements />

        {/* Skippi Vending Stall */}
        <SkippiStall
          position={[0, 0, 0]}
          onStallClick={() => setCameraMode('stall_counter')}
          selectedFlavorId={selectedProduct?.id}
        />

        {/* Salesperson Behind Counter */}
        <SalespersonRavi
          position={[0, 0, -0.45]}
          customerLifecycle={lifecycle}
          selectedPopColor={selectedPopColor}
        />

        {/* Interactive Approaching Customer */}
        {lifecycle !== 'departed' && (
          <CustomerCharacter
            key={currentCustomer.id}
            customer={currentCustomer}
            lifecycle={lifecycle}
            receivedPopColor={selectedPopColor}
            onArrivedAtCounter={handleArrivedAtCounter}
            onDeparted={handleCustomerDeparted}
          />
        )}

        {/* Smooth Camera Director */}
        <CameraRig
          mode={cameraMode}
          isCustomerAtCounter={lifecycle !== 'walking_to_stall' && lifecycle !== 'walking_away'}
        />
      </Canvas>

      {/* Top HUD with brand, stats and camera controls */}
      <TopHUD
        stats={stats}
        currentObjective={currentObjectiveText}
        cameraMode={cameraMode}
        onCameraModeChange={(m) => setCameraMode(m)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenBusinessHub={() => setShowBusinessHub(true)}
      />

      {/* Interactive Customer Conversation & Strategy Selection */}
      {lifecycle === 'dialogue' && (
        <DialogueBox
          customer={currentCustomer}
          onChoiceSelected={handleDialogueChoice}
          onProceedToProductSelection={handleProceedToProduct}
        />
      )}

      {/* Interactive Skippi Shelf Product Selector & Handover */}
      {lifecycle === 'selecting_product' && (
        <ProductSelector
          customer={currentCustomer}
          onProductSelectedAndHandedOver={handleProductHandover}
        />
      )}

      {/* Celebratory Banner & Next Customer Trigger */}
      {lifecycle === 'celebrating' && (
        <CelebrationBanner
          customer={currentCustomer}
          xpEarned={currentCustomer.rewardXp}
          onNextCustomer={handleNextCustomer}
          isLastCustomer={isLastCustomer}
        />
      )}

      {/* Shark Tank Capstone Final Evaluation Modal */}
      {showSharkModal && (
        <SharkTankEvaluationModal
          stats={stats}
          onRestart={handleRestart}
        />
      )}

      {/* Skippi Business Hub & Strategy Modal */}
      <BusinessHubModal
        isOpen={showBusinessHub}
        onClose={() => setShowBusinessHub(false)}
        onCampaignLaunched={(bonusXp) => {
          setStats((prev) => ({
            ...prev,
            xp: prev.xp + bonusXp
          }));
        }}
      />

      {/* Interactive Controls & Navigation Helper */}
      <ControlsGuide />
    </div>
  );
}

export default App;

