//Credit to https://github.com/drcmda for this effect
import ReactDOM from 'react-dom'
import {Math as ThreeMath, OctahedronBufferGeometry, MeshBasicMaterial, Color} from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import helveticaRegular from 'three/examples/fonts/helvetiker_regular.typeface.json';
// A THREE.js React renderer, see: https://github.com/drcmda/react-three-fiber
import { extend as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
// A React animation lib, see: https://github.com/react-spring/react-spring
import { apply as applySpring, useSpring, a } from 'react-spring/three'
import {useSpring as useReactSpring, animated, interpolate} from 'react-spring'
import Fab from "@material-ui/core/Fab";
import {showLandingSite, showNavigationWrapper} from '../state/actions';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {store} from '../state';
import Layout from "./layout"
import {useSelector} from 'react-redux';
//import society0xLogo from "../images/society0x_transparent_white_thicker.png";
import society0xLogo from "../images/society0x_transparent_white_thicker.png";
import Backdrop from '@material-ui/core/Backdrop';


// Import and register postprocessing classes as three-native-elements for both react-three-fiber & react-spring
// They'll be available as native elements <effectComposer /> from then on ...
import { EffectComposer } from '../utils/postprocessing/EffectComposer'
import { RenderPass } from '../utils/postprocessing/RenderPass'
import { GlitchPass } from '../utils/postprocessing/GlitchPass'

applySpring({ EffectComposer, RenderPass, GlitchPass })
applyThree({ EffectComposer, RenderPass, GlitchPass })

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
  },
}));

/** This renders text via canvas and projects it as a sprite */
function Text({ children, position, opacity, color = 'white', fontSize = 200, isConsideredMobile, showFragmentDistortion }) {
  const {
    size: { width, height },
    viewport: { width: viewportWidth, height: viewportHeight }
  } = useThree()
  const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
  if(isConsideredMobile) {
    fontSize = 200
    if(showFragmentDistortion){
      fontSize = 400
    }
  }else{
    fontSize = 210
    if(showFragmentDistortion){
      fontSize = 400
    }
  }
  const canvas = useMemo(
    () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 2048
      const context = canvas.getContext('2d')
      context.font = `bold ${fontSize}px monospace, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = color
      context.shadowColor = "rgba(0,0,0,0.7)";
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 10;
      context.shadowBlur = 15;
      context.fillText(children, 1024, 1024 - 410 / 2)
      return canvas
    },
    [children, width, height]
  )
  return (
    <a.sprite scale={[scale, scale, 1]} position={position}>
      <a.spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </a.spriteMaterial>
    </a.sprite>
  )
}

function Icon({ children, position, opacity, color = '#000000', fontSize = 800, isConsideredMobile }) {
        const {
        size: { width, height },
        viewport: { width: viewportWidth, height: viewportHeight }
        } = useThree()
        const scale = viewportWidth > viewportHeight ? viewportWidth : viewportHeight
        if(isConsideredMobile) {
        fontSize = 800
        }else{
        fontSize = 1200
        }
        const canvas = useMemo(
        () => {
            const canvas = document.createElement('canvas')
            canvas.width = canvas.height = 2048
            const context = canvas.getContext('2d')
            context.font = `${fontSize}px  monospace, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.fillStyle = color
            context.shadowColor = "rgba(0,0,0,0.7)";
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 5;
            context.shadowBlur = 10;
            context.fillText(children, 1024, 1024 - 410 / 2)
            return canvas
        },
        [children, width, height]
        )
        return (
        <a.sprite scale={[scale, scale, 1]} position={position}>
            <a.spriteMaterial attach="material" transparent opacity={opacity}>
            <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
            </a.spriteMaterial>
        </a.sprite>
        )

  }

/** This component creates a fullscreen colored plane */
function Background({ color }) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <a.meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}

/** This component rotates a bunch of Octahedrons */
function Octahedrons({ position, color }) {
  let group = useRef()
  let theta = 0
  useRender(() => {
    if(group.current){
      const r = 5 * Math.sin(ThreeMath.degToRad((theta += 0.01)))
      const s = Math.cos(ThreeMath.degToRad(theta * 2))
      group.current.rotation.set(r, r, r)
      group.current.scale.set(s, s, s)
    }
  })
  const [geo, mat, coords] = useMemo(() => {
    const geo = new OctahedronBufferGeometry(2)
    const mat = new MeshBasicMaterial({ transparent: true, wireframe: true })
    const coords = new Array(500).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
    return [geo, mat, coords]
  }, [])
  return (
    <a.group ref={group} position={position}>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </a.group>
  )
}

/** This component creates a glitch effect */
const Effects = React.memo(({ factor, showFragmentDistortion }) => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  
    useEffect(() => void composer.current.setSize(size.width, size.height), [size])
    // This takes over as the main render-loop (when 2nd arg is set to true)
    useRender(() => {if (composer.current) {composer.current.render()}},true)
    return (
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />
        <a.glitchPass attachArray="passes" renderToScreen factor={factor} showFragmentDistortion={showFragmentDistortion} />
      </effectComposer>
    )
  
})

/** This component maintains the scene */
function Scene({ glitch, top, effectsTop, isConsideredMobile, showFragmentDistortion, showDAO}) {
  const { size } = useThree()
  const scrollMax = size.height * 4.5
  return (
    <>
      <Effects showFragmentDistortion={showFragmentDistortion} factor={effectsTop.interpolate([0, 150], [1, 0])} />
      <Background color={top.interpolate([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], ['#272727'])} />
      <Octahedrons position={top.interpolate(top => [0, -1 + top / 20, 0])} />
      <Icon opacity={0.8} isConsideredMobile={isConsideredMobile} position={top.interpolate(top => [0, -1 + top / 200, 0])}>
        ⎊
      </Icon>
      <Text opacity={0.9} showFragmentDistortion={showFragmentDistortion} isConsideredMobile={isConsideredMobile} position={top.interpolate(top => [0, -0.68 + top / 200, 0])}>
        {showDAO ? "D A O" : "society0x"}
      </Text>
    </>
  )
}

/** Main component */
const LandingZone = () => {
  // This tiny spring right here controlls all(!) the animations, one for scroll, the other for mouse movement ...
  if (typeof window !== 'undefined') {
    const [{ top, mouse }, set] = useSpring(() => ({ top: 0, mouse: [0, 0] }))
    const [{ topReactSpring }, setReactSpring] = useReactSpring(() => ({ topReactSpring: 80 }))
    const [{ manifestoSpring }, setManifestoSpring] = useReactSpring(() => ({ manifestoSpring: 100 }))
    const [buttonOpacity, setButtonOpacity] = useState(1);
    const [manifestoOpen, setManifestoOpen] = useState(false);
    const [{ top: effectsTop }] = useSpring(() => ({ top: 135 }))
    const [{ topOverride }] = useSpring(() => ({ topOverride: 70 }))
    const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), [])
    const onScrollThreeJS = useCallback(e => set({ top: e.target.scrollTop }), [])
    const onScrollReactSpring = useCallback(e => setReactSpring({ topReactSpring: 80 - (e.target.scrollTop / 10) }), [])
    
    const onToggleManifestoSpring = useCallback((e, clickaway = false) => {
        console.log("manifestoSpring",manifestoSpring);
        if (!clickaway || (clickaway && (manifestoSpring.value < 95))) {
            e.stopPropagation();
            e.preventDefault();
            setManifestoSpring({ manifestoSpring: manifestoOpen ? 100 : 50 })
            setManifestoOpen(!manifestoOpen);
        }
    })
    let scrollPane = React.createRef();
    const onWheelReactSpring = useCallback(e => {console.log(e.deltaY, 80 - ((e.deltaY + scrollPane.current.scrollTop) / 10));setReactSpring({ topReactSpring: 80 - (e.deltaY - scrollPane.current.scrollTop / 10) })}, [scrollPane])
    //let showLeftMenu = store.getState().showLeftMenu;
    let showLeftMenu = store.getState().showLeftMenu
    store.subscribe(() => {
      showLeftMenu = store.getState().showLeftMenu
    });

    //let isConsideredMobile = useSelector(state => state.isConsideredMobile)
    let isConsideredMobile = false;
    const classes = useStyles();
    
    return (
      <>
        <Canvas className="canvas">
          <Scene topOverride={topOverride} top={top} isConsideredMobile={isConsideredMobile} showDAO={showLeftMenu} showFragmentDistortion={showLeftMenu} effectsTop={showLeftMenu ? topOverride : effectsTop} mouse={mouse} />
        </Canvas>
        <div ref={scrollPane} className="scroll-container" onScroll={(e) => { onScrollThreeJS(e);onScrollReactSpring(e);setButtonOpacity((1 - e.target.scrollTop / 100)); }} onMouseMove={onMouseMove}>
          <div style={{ height: '280vh' }}>
          </div>
        </div>
        <div style={{ top: `70%`, position: 'absolute', transform: 'translateX(-50%)', left: '50%', transition: 'all 0.3s ease-in-out', opacity: buttonOpacity, pointerEvents: (buttonOpacity < 0) ? 'none' : '' }}>
            <Fab onClick={(e) => { onToggleManifestoSpring(e)}} style={{ opacity: '0.85', display: 'block', width: '100%'  }} color="primary" size="large" variant="extended">
              Developing
            </Fab>
            <a href="https://discord.gg/UAJMkPV" style={{ textDecoration: 'none', display: 'block', marginTop: '10px' }} target="_blank" rel="noreferrer noopener">
              <Fab style={{ opacity: '0.85', display: 'block' }} color="default" size="large" variant="extended">
                Join Discussion
            </Fab>
            </a>
            {/* <Fab onClick={() => launchBeta()} style={{opacity: '0.85', display: 'block', width: '100%', marginTop: '10px'}} color="default" size="medium" variant="extended">
            Launch Beta
          </Fab> */}
        </div>
        <div>
        <Backdrop open={manifestoOpen ? true : false} style={{zIndex: 5}}></Backdrop>
        <animated.div onWheel={(e) => { onWheelReactSpring(e); }} style={{ zIndex: 10, position: 'absolute', top: manifestoSpring.interpolate(top => `${top}%`), left: '50%', transform: manifestoSpring.interpolate(top => `translateX(-50%)translateY(-${100 - top}%)`) }}>
            <ClickAwayListener onClickAway={(e) => { onToggleManifestoSpring(e, true)}}>
                <Paper elevation={12} className={classes.root} style={{textShadow: "0px 0px 8px #000"}}>
                    <div style={{textAlign: 'center'}}>
                    <img src={society0xLogo} style={{maxWidth:'70px',marginBottom: '10px', filter: "drop-shadow(0px 0px 8px #000)"}}></img>
                    </div>
                    <Typography style={{ textAlign: 'center' }} variant="h5" component="h3">
                    ⎊ Transmuting Prima Materia ⎊
                    </Typography>
                </Paper>
            </ClickAwayListener>
        </animated.div>
        </div>
        </>
    )
  }
  return null
}

export default LandingZone;