import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './integrations/supabase/client';
import { LANG_META, UI_STRINGS } from './data/languages';
import { MODULES, PHOTO_COMPONENTS, CHECKLIST_DATA, PRICING_SERVICES } from './data/modules';
import CourseView from './components/CourseView';
import PhotosView from './components/PhotosView';
import WorkshopView from './components/WorkshopView';
import CertificateView from './components/CertificateView';
import Header from './components/Header';
import ToastContainer from './components/ToastContainer';
import LightboxModal from './components/LightboxModal';
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [lang, setLang] = useState('pt');
  const [view, setView] = useState('course');
  const [currentMod, setCurrentMod] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [visualMode, setVisualMode] = useState('photo');
  const [completedModules, setCompletedModules] = useState([]);
  const [photos, setPhotos] = useState({});
  const [photoFilter, setPhotoFilter] = useState('all');
  const [checklist, setChecklist] = useState(Array(8).fill(false));
  const [selectedServices, setSelectedServices] = useState({});
  const [quoteClient, setQuoteClient] = useState('');
  const [quoteModel, setQuoteModel] = useState('DJI Agras T40');
  const [studentName, setStudentName] = useState('Douglas Coutrim Silva');
  const [certificateIssuedAt, setCertificateIssuedAt] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [lightbox, setLightbox] = useState({ open: false, src: '', title: '' });
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lab states
  const [lab0Step, setLab0Step] = useState(0);
  const [lab1Pattern, setLab1Pattern] = useState('led2');
  const [lab2FixedFuses, setLab2FixedFuses] = useState([]);
  const [lab3Delta, setLab3Delta] = useState(0.240);
  const [lab4Wired, setLab4Wired] = useState({});
  const [lab5Checked, setLab5Checked] = useState([]);
  const [lab6Timer, setLab6Timer] = useState(0);
  const [lab6Running, setLab6Running] = useState(false);
  const [lab7Cutoff, setLab7Cutoff] = useState(52.0);

  const playTimerRef = useRef(null);
  const lab6IntervalRef = useRef(null);

  const t = useCallback((key) => {
    return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.pt[key] || key;
  }, [lang]);

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load user data from Supabase
  useEffect(() => {
    if (!user) return;
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      // Profile (full name shown on certificate)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (profile?.full_name) setStudentName(profile.full_name);

      // Course progress
      const { data: progress } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);
      if (progress) {
        setCompletedModules(progress.filter(p => p.completed).map(p => p.module_id));
      }

      // Photos
      const { data: userPhotos } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', user.id);
      if (userPhotos) {
        const photoMap = {};
        for (const p of userPhotos) {
          const { data: urlData } = supabase.storage
            .from('user-photos')
            .getPublicUrl(p.storage_path);
          photoMap[p.component_id] = urlData.publicUrl;
        }
        setPhotos(photoMap);
      }

      // Checklist
      const { data: checklistData } = await supabase
        .from('workshop_checklist')
        .select('*')
        .eq('user_id', user.id);
      if (checklistData) {
        const newChecklist = Array(8).fill(false);
        checklistData.forEach(item => {
          newChecklist[item.item_index] = item.completed;
        });
        setChecklist(newChecklist);
      }

      // Issued certificate
      const { data: certificate } = await supabase
        .from('certificates')
        .select('student_name, issued_at')
        .eq('user_id', user.id)
        .maybeSingle();
      if (certificate) {
        setCertificateIssuedAt(certificate.issued_at);
        if (certificate.student_name) setStudentName(certificate.student_name);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  // Save course progress
  const saveCourseProgress = async (moduleId, completed, slideIndex) => {
    if (!user) return;
    try {
      await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed,
          slide_index: slideIndex,
          last_accessed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id' });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  // Save checklist
  const saveChecklistItem = async (index, completed) => {
    if (!user) return;
    try {
      await supabase
        .from('workshop_checklist')
        .upsert({
          user_id: user.id,
          item_index: index,
          completed,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,item_index' });
    } catch (err) {
      console.error('Error saving checklist:', err);
    }
  };

  // Toast functions
  const showToast = useCallback((msg, tone = 'emerald') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, tone }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  // Lightbox
  const openLightbox = useCallback((src, title) => {
    setLightbox({ open: true, src, title });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, src: '', title: '' });
  }, []);

  // Confirm modal
  const showConfirmModal = useCallback((title, message, onConfirm) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
  }, []);

  // Language change
  const setLanguage = useCallback((langCode, silent = false) => {
    if (!LANG_META[langCode]) return;
    stopLesson();
    setLang(langCode);
    document.documentElement.lang = LANG_META[langCode].htmlLang;
    if (!silent) showToast(t('toastLang'), 'emerald');
  }, [t, showToast]);

  // View switch
  const switchView = useCallback((viewName) => {
    stopLesson();
    setView(viewName);
  }, []);

  // Module selection
  const selectModule = useCallback((modId) => {
    stopLesson();
    setCurrentMod(modId);
    setCurrentSlide(0);
    saveCourseProgress(modId, completedModules.includes(modId), 0);
  }, [completedModules]);

  // Toggle module complete
  const toggleCurrentModuleComplete = useCallback(() => {
    const id = currentMod;
    const idx = completedModules.indexOf(id);
    let newCompleted;
    if (idx === -1) {
      newCompleted = [...completedModules, id];
    } else {
      newCompleted = completedModules.filter(m => m !== id);
    }
    setCompletedModules(newCompleted);
    saveCourseProgress(id, idx === -1, currentSlide);
  }, [currentMod, completedModules, currentSlide]);

  // Player controls
  const speakCurrentSlide = useCallback(() => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const text = MODULES[currentMod].slides[lang][currentSlide];
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = LANG_META[lang].speech;
      utter.rate = 1.02;
      window.speechSynthesis.speak(utter);
    } catch (e) { /* ignore */ }
  }, [voiceEnabled, currentMod, currentSlide, lang]);

  const togglePlayLesson = useCallback(() => {
    if (isPlaying) {
      stopLesson();
      return;
    }
    setIsPlaying(true);
    speakCurrentSlide();
    playTimerRef.current = setInterval(() => {
      const total = MODULES[currentMod].slides[lang].length;
      if (currentSlide < total - 1) {
        setCurrentSlide(prev => prev + 1);
        speakCurrentSlide();
      } else {
        stopLesson();
      }
    }, 7500);
  }, [isPlaying, currentMod, currentSlide, lang, speakCurrentSlide]);

  const stopLesson = useCallback(() => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }, []);

  const toggleVoiceNarration = useCallback(() => {
    setVoiceEnabled(prev => !prev);
    if (voiceEnabled && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }, [voiceEnabled]);

  const nextSlide = useCallback(() => {
    const total = MODULES[currentMod].slides[lang].length;
    setCurrentSlide(prev => (prev + 1) % total);
    if (isPlaying) speakCurrentSlide();
  }, [currentMod, lang, isPlaying, speakCurrentSlide]);

  const prevSlide = useCallback(() => {
    const total = MODULES[currentMod].slides[lang].length;
    setCurrentSlide(prev => (prev - 1 + total) % total);
    if (isPlaying) speakCurrentSlide();
  }, [currentMod, lang, isPlaying, speakCurrentSlide]);

  // Photo upload
  const compressImageFile = useCallback((file, callback) => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const img = new Image();
      img.onload = function() {
        const maxDim = 1200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePhotoUploadForComponent = useCallback(async (cid, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    compressImageFile(file, async (dataUrl) => {
      if (user) {
        // Upload to Supabase Storage (user-photos bucket)
        const fileName = `${user.id}/${cid}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(fileName, dataUrl.split(',')[1], {
            contentType: 'image/jpeg',
            upsert: true,
          });
        if (uploadError) {
          console.error('Upload error:', uploadError);
          showToast('Erro ao enviar foto.', 'rose');
          return;
        }
        // Save reference in database
        const { error: dbError } = await supabase
          .from('user_photos')
          .upsert({
            user_id: user.id,
            component_id: cid,
            storage_path: fileName,
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
          }, { onConflict: 'user_id,component_id' });
        if (dbError) {
          console.error('DB error:', dbError);
        }
        const { data: urlData } = supabase.storage
          .from('user-photos')
          .getPublicUrl(fileName);
        setPhotos(prev => ({ ...prev, [cid]: urlData.publicUrl }));
      } else {
        // Fallback to local state only
        setPhotos(prev => ({ ...prev, [cid]: dataUrl }));
      }
      showToast(t('toastPhotoSaved'), 'emerald');
    });
  }, [user, compressImageFile, showToast, t]);

  const requestRemovePhoto = useCallback((cid) => {
    showConfirmModal(t('confirmRemoveTitle'), t('confirmRemoveMsg'), async () => {
      if (user) {
        const { data: photoData } = await supabase
          .from('user_photos')
          .select('storage_path')
          .eq('user_id', user.id)
          .eq('component_id', cid)
          .maybeSingle();
        if (photoData) {
          await supabase.storage.from('user-photos').remove([photoData.storage_path]);
          await supabase.from('user_photos').delete().eq('user_id', user.id).eq('component_id', cid);
        }
      }
      setPhotos(prev => {
        const next = { ...prev };
        delete next[cid];
        return next;
      });
      showToast(t('toastPhotoRemoved'), 'amber');
    });
  }, [user, showConfirmModal, showToast, t]);

  // Checklist toggle
  const toggleChecklist = useCallback((i) => {
    setChecklist(prev => {
      const next = [...prev];
      next[i] = !next[i];
      saveChecklistItem(i, next[i]);
      return next;
    });
  }, [user]);

  // Service toggle
  const toggleService = useCallback((id) => {
    setSelectedServices(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Reset quote
  const resetQuote = useCallback(() => {
    setSelectedServices({});
    setQuoteClient('');
    setQuoteModel('DJI Agras T40');
  }, []);

  // Build the WhatsApp quote text (shared by copy + save)
  const buildQuoteText = useCallback((client, model, chosen, total) => {
    return [
      `⚡ *VOLTMASTER — ORÇAMENTO TÉCNICO*`,
      `👤 ${client} | 🔋 ${model}`,
      `--------------------------------`,
      ...(chosen.length ? chosen.map(s => `• ${s.names[lang]} (${s.range})`) : ['• Diagnóstico de Bancada']),
      `--------------------------------`,
      `💰 *Total Estimado:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `📞 Suporte VoltMaster: (61) 9 8524-5726`,
    ].join('\n');
  }, [lang]);

  // Copy WhatsApp quote
  const copyWhatsAppQuote = useCallback(() => {
    const client = quoteClient.trim() || 'Cliente';
    const chosen = PRICING_SERVICES.filter(s => selectedServices[s.id]);
    const total = chosen.reduce((acc, s) => acc + s.price, 0);
    const lines = buildQuoteText(client, quoteModel, chosen, total);
    const ta = document.createElement('textarea');
    ta.value = lines;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(t('toastCopied'), 'emerald');
    } catch (e) {
      showToast('Erro ao copiar.', 'rose');
    }
    document.body.removeChild(ta);
  }, [selectedServices, quoteClient, quoteModel, buildQuoteText, showToast, t]);

  // Persist the quote into the service_quotes table
  const saveServiceQuote = useCallback(async () => {
    if (!user) {
      showToast(t('toastNeedLogin'), 'amber');
      return;
    }
    const client = quoteClient.trim() || 'Cliente';
    const chosen = PRICING_SERVICES.filter(s => selectedServices[s.id]);
    const total = chosen.reduce((acc, s) => acc + s.price, 0);
    const { error } = await supabase.from('service_quotes').insert({
      user_id: user.id,
      client_name: client,
      battery_model: quoteModel,
      services: chosen.map(s => ({ id: s.id, name: s.names[lang], price: s.price, range: s.range })),
      total_estimate: total,
      quote_text: buildQuoteText(client, quoteModel, chosen, total),
    });
    if (error) showToast(error.message, 'rose');
    else showToast(t('toastQuoteSaved'), 'emerald');
  }, [user, quoteClient, quoteModel, selectedServices, lang, buildQuoteText, showToast, t]);

  // Persist profile full name
  const saveProfileName = useCallback(async (name) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: name, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) showToast(error.message, 'rose');
    else showToast(t('toastProfileSaved'), 'emerald');
  }, [user, showToast, t]);

  // Issue (and persist) the completion certificate
  const issueCertificate = useCallback(async () => {
    if (!user) {
      showToast(t('toastNeedLogin'), 'amber');
      return;
    }
    const issuedAt = new Date().toISOString();
    const { error } = await supabase.from('certificates').upsert({
      user_id: user.id,
      student_name: studentName,
      completed_modules: completedModules,
      certificate_data: { lang, issued_at: issuedAt, total_modules: MODULES.length },
    }, { onConflict: 'user_id' });
    if (error) {
      showToast(error.message, 'rose');
    } else {
      setCertificateIssuedAt(issuedAt);
      showToast(t('toastCertIssued'), 'emerald');
    }
  }, [user, studentName, completedModules, lang, showToast, t]);

  // Lab functions
  const clickLab0 = useCallback((stepId) => {
    if (stepId === lab0Step) {
      setLab0Step(prev => prev + 1);
      if (lab0Step + 1 === 5) showToast(t('correct'), 'emerald');
    } else {
      showToast(t('wrong'), 'rose');
    }
  }, [lab0Step, showToast, t]);

  const testSmdFuse = useCallback((n) => {
    const openFuses = [4, 11];
    if (openFuses.includes(n) && !lab2FixedFuses.includes(n)) {
      setLab2FixedFuses(prev => [...prev, n]);
      showToast(`F${n}: SEM BIP! Jumper aplicado a 320°C ✓`, 'emerald');
    } else {
      showToast(`F${n}: BIP contínuo (OK)`, 'amber');
    }
  }, [lab2FixedFuses, showToast]);

  const runEqualizerPulse = useCallback(() => {
    setLab3Delta(prev => Math.max(0.012, prev - 0.065));
  }, []);

  const toggleLab5 = useCallback((i) => {
    setLab5Checked(prev => {
      const idx = prev.indexOf(i);
      if (idx === -1) return [...prev, i];
      return prev.filter(x => x !== i);
    });
  }, []);

  const toggleLab6Timer = useCallback(() => {
    if (lab6Running) {
      clearInterval(lab6IntervalRef.current);
      setLab6Running(false);
      if (lab6Timer >= 4 && lab6Timer <= 5) showToast(t('correct') + ' (4–5s)', 'emerald');
      else showToast(lab6Timer > 5 ? '⚠ >5s: Risco de superaquecimento!' : '⚠ <4s: Estanho ainda não fundiu!', 'rose');
    } else {
      setLab6Timer(0);
      setLab6Running(true);
      lab6IntervalRef.current = setInterval(() => {
        setLab6Timer(prev => prev + 0.1);
      }, 100);
    }
  }, [lab6Running, lab6Timer, showToast, t]);

  // Export functions
  const exportPhotosJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(photos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voltmaster-fotos-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [photos]);

  const exportStandaloneHTML = useCallback(() => {
    showToast('Funcionalidade disponível apenas na versão HTML original.', 'amber');
  }, [showToast]);

  // Upload a full backup to the private user-files bucket
  const uploadBackupToCloud = useCallback(async () => {
    if (!user) {
      showToast(t('toastNeedLogin'), 'amber');
      return;
    }
    const payload = {
      studentName,
      completedModules,
      checklist,
      photos,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const path = `${user.id}/backup-${Date.now()}.json`;
    const { error } = await supabase.storage
      .from('user-files')
      .upload(path, blob, { contentType: 'application/json' });
    if (error) showToast(error.message, 'rose');
    else showToast(t('toastCloudSaved'), 'emerald');
  }, [user, studentName, completedModules, checklist, photos, showToast, t]);

  // Auth functions
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showToast(error.message, 'rose');
  };

  const signUp = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) showToast(error.message, 'rose');
    else showToast('Conta criada! Verifique seu email.', 'emerald');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCompletedModules([]);
    setPhotos({});
    setChecklist(Array(8).fill(false));
    setCertificateIssuedAt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="text-emerald-400 font-mono-tech text-lg animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header
        lang={lang}
        setLanguage={setLanguage}
        view={view}
        switchView={switchView}
        completedModules={completedModules}
        user={user}
        signIn={signIn}
        signUp={signUp}
        signOut={signOut}
        t={t}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-6">
        {view === 'course' && (
          <CourseView
            lang={lang}
            currentMod={currentMod}
            currentSlide={currentSlide}
            isPlaying={isPlaying}
            voiceEnabled={voiceEnabled}
            visualMode={visualMode}
            completedModules={completedModules}
            photos={photos}
            t={t}
            selectModule={selectModule}
            toggleCurrentModuleComplete={toggleCurrentModuleComplete}
            togglePlayLesson={togglePlayLesson}
            stopLesson={stopLesson}
            toggleVoiceNarration={toggleVoiceNarration}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
            setPlayerVisualMode={setVisualMode}
            triggerQuickPhotoUpload={handlePhotoUploadForComponent}
            focusComponentInPlayer={(cid) => {
              if (photos[cid]) {
                setVisualMode('photo');
              } else {
                handlePhotoUploadForComponent(cid, null);
              }
            }}
            lab0Step={lab0Step}
            lab1Pattern={lab1Pattern}
            lab2FixedFuses={lab2FixedFuses}
            lab3Delta={lab3Delta}
            lab4Wired={lab4Wired}
            lab5Checked={lab5Checked}
            lab6Timer={lab6Timer}
            lab6Running={lab6Running}
            lab7Cutoff={lab7Cutoff}
            clickLab0={clickLab0}
            setLab1Pattern={setLab1Pattern}
            testSmdFuse={testSmdFuse}
            runEqualizerPulse={runEqualizerPulse}
            setLab4Wired={setLab4Wired}
            toggleLab5={toggleLab5}
            toggleLab6Timer={toggleLab6Timer}
            setLab7Cutoff={setLab7Cutoff}
            switchView={switchView}
            showToast={showToast}
          />
        )}

        {view === 'photos' && (
          <PhotosView
            lang={lang}
            photos={photos}
            photoFilter={photoFilter}
            setPhotoFilter={setPhotoFilter}
            t={t}
            handlePhotoUploadForComponent={handlePhotoUploadForComponent}
            requestRemovePhoto={requestRemovePhoto}
            openLightbox={openLightbox}
            exportPhotosJSON={exportPhotosJSON}
            exportStandaloneHTML={exportStandaloneHTML}
            uploadBackupToCloud={uploadBackupToCloud}
          />
        )}

        {view === 'workshop' && (
          <WorkshopView
            lang={lang}
            checklist={checklist}
            toggleChecklist={toggleChecklist}
            selectedServices={selectedServices}
            toggleService={toggleService}
            quoteClient={quoteClient}
            setQuoteClient={setQuoteClient}
            quoteModel={quoteModel}
            setQuoteModel={setQuoteModel}
            resetQuote={resetQuote}
            copyWhatsAppQuote={copyWhatsAppQuote}
            saveServiceQuote={saveServiceQuote}
            t={t}
          />
        )}

        {view === 'certificate' && (
          <CertificateView
            lang={lang}
            studentName={studentName}
            setStudentName={setStudentName}
            saveProfileName={saveProfileName}
            issueCertificate={issueCertificate}
            certificateIssuedAt={certificateIssuedAt}
            completedModules={completedModules}
            t={t}
          />
        )}
      </main>

      <ToastContainer toasts={toasts} />
      <LightboxModal lightbox={lightbox} closeLightbox={closeLightbox} />
      <ConfirmModal confirmModal={confirmModal} closeConfirmModal={closeConfirmModal} t={t} />
    </div>
  );
}

export default App;
