const mobileVhFix = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isIE = !!window.MSInputMethodContext && !!document.documentMode;

  if (!isIE && (isMobile || isIPad)) {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
  }
};

export {mobileVhFix};
