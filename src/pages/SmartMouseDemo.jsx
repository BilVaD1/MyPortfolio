import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'

import dashboard from '../data/Dashboard.png'

const Section = ({ title, children, hint }) => (
  <div className='mb-12'>
    <h2 className='text-2xl font-bold mb-1 dark:text-yellow-200 text-orange-500'>{title}</h2>
    {hint && <p className='text-sm mb-4 text-gray-500 dark:text-gray-400'>{hint}</p>}
    {children}
  </div>
)

const SmartMouseDemo = () => {
  const { mouseConfig, setMouseConfig } = useStateContext();

  const updateConfig = (key, value) => setMouseConfig((prev) => ({ ...prev, [key]: value }))

  return (
    <div className='dark:text-white mt-[100px] pb-[100px] max-w-4xl mx-auto px-6'>

      <h1 className='text-4xl font-extrabold mb-2'>react-smart-mouse</h1>
      <p className='mb-2 text-lg'>
        The cursor you are moving right now is the{' '}
        <a
          href='https://www.npmjs.com/package/react-smart-mouse'
          target='_blank'
          rel='noreferrer'
          className='text-indigo-500 underline cursor-none'
        >
          react-smart-mouse
        </a>{' '}
        npm package — a smart cursor follower that adapts to whatever it hovers. Move it around this page to try every feature.
      </p>
      <code className='inline-block mb-10 px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-sm'>
        npm install react-smart-mouse
      </code>

      <Section title='Live controls' hint='These change the props of the global SmartMouse instance in real time.'>
        <div className='flex flex-col gap-4 max-w-md'>
          <label className='flex items-center justify-between gap-4 cursor-none'>
            <span>Trailing (lerp): <b>{mouseConfig.lerp}</b></span>
            <input
              type='range'
              min='0.05'
              max='1'
              step='0.05'
              value={mouseConfig.lerp}
              onChange={(e) => updateConfig('lerp', Number(e.target.value))}
              className='w-48'
            />
          </label>
          <label className='flex items-center justify-between gap-4 cursor-none'>
            <span>Click scale: <b>{mouseConfig.clickScale}</b></span>
            <input
              type='range'
              min='0.5'
              max='1'
              step='0.05'
              value={mouseConfig.clickScale}
              onChange={(e) => updateConfig('clickScale', Number(e.target.value))}
              className='w-48'
            />
          </label>
          <label className='flex items-center gap-3 cursor-none'>
            <input
              type='checkbox'
              checked={mouseConfig.blendMode === 'difference'}
              onChange={(e) => updateConfig('blendMode', e.target.checked ? 'difference' : undefined)}
            />
            <span>Blend mode: <code>difference</code> (invert colors under the cursor)</span>
          </label>
          <label className='flex items-center gap-3 cursor-none'>
            <input
              type='checkbox'
              checked={mouseConfig.glass}
              onChange={(e) => updateConfig('glass', e.target.checked)}
            />
            <span>Glass mode 🧊 — frosted cursor, colors become translucent tints</span>
          </label>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Tip: the sliders above have their own cursor style too — and toggling any checkbox makes the cursor pulse ✨
          </p>
        </div>
      </Section>

      <Section
        title='Image magnifier'
        hint='Add mousemagnify to any image and the cursor becomes a zoom lens over it.'
      >
        <img
          src={dashboard}
          alt='Magnify me'
          data-mousemagnify=''
          className='rounded-xl w-full max-w-xl shadow-lg'
        />
      </Section>

      <Section
        title='Element-aware by default'
        hint='No configuration — the cursor recognizes the element type under it.'
      >
        <div className='flex flex-wrap items-center gap-6'>
          <button type='button' className='px-4 py-2 rounded bg-indigo-500 text-white cursor-none'>Button</button>
          <a href='#link' onClick={(e) => e.preventDefault()} className='text-indigo-500 underline cursor-none'>Link</a>
          <input type='text' placeholder='Text input' className='border rounded px-3 py-2 dark:bg-gray-800 cursor-none' />
          <label className='flex items-center gap-2 cursor-none'><input type='checkbox' /> Checkbox</label>
          <label className='flex items-center gap-2 cursor-none'><input type='radio' /> Radio</label>
        </div>
      </Section>

      <Section
        title='Text labels'
        hint='Add mouselabel="View" to any element and the cursor announces it.'
      >
        <div className='grid sm:grid-cols-2 gap-4'>
          <div
            data-mouselabel='View'
            data-mousecustom={JSON.stringify({ width: '70px', height: '70px', color: 'rgba(99, 102, 241, 0.85)', top: '-35px', left: '-35px' })}
            className='h-32 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold'
          >
            Hover me — “View”
          </div>
          <div
            data-mouselabel='Drag'
            data-mousecustom={JSON.stringify({ width: '70px', height: '70px', color: 'rgba(236, 72, 153, 0.85)', top: '-35px', left: '-35px' })}
            className='h-32 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center text-white font-semibold'
          >
            Hover me — “Drag”
          </div>
        </div>
      </Section>

      <Section
        title='Magnetic elements'
        hint='The cursor snaps to the center of elements marked with mousemagnetic. Try a low lerp for the full effect.'
      >
        <div className='flex flex-wrap gap-6'>
          <button type='button' data-mousemagnetic='' className='px-6 py-3 rounded-full border-2 border-indigo-500 cursor-none'>
            Magnetic
          </button>
          <button type='button' data-mousemagnetic='' className='px-6 py-3 rounded-full border-2 border-pink-500 cursor-none'>
            Also magnetic
          </button>
        </div>
      </Section>

      <Section
        title='Per-element styles'
        hint='Any element can define its own cursor with a mousecustom JSON attribute.'
      >
        <div className='flex flex-wrap gap-6'>
          <span
            data-mousecustom={JSON.stringify({ width: '60px', height: '60px', color: 'rgba(34, 197, 94, 0.5)' })}
            className='px-4 py-2 rounded bg-green-100 dark:bg-green-900 cursor-none'
          >
            Big green
          </span>
          <span
            data-mousecustom={JSON.stringify({ width: '8px', height: '8px', color: 'rgba(239, 68, 68, 1)' })}
            className='px-4 py-2 rounded bg-red-100 dark:bg-red-900 cursor-none'
          >
            Tiny red
          </span>
          <span
            data-mousecustom={JSON.stringify({ width: '40px', height: '12px', color: 'rgba(59, 130, 246, 0.7)' })}
            className='px-4 py-2 rounded bg-blue-100 dark:bg-blue-900 cursor-none'
          >
            Flat blue
          </span>
        </div>
      </Section>

      <p className='text-sm text-gray-500 dark:text-gray-400'>
        Note: the custom cursor is enabled on devices with a mouse (screens wider than 900px). Sources on{' '}
        <a
          href='https://github.com/BilVaD1/SmartMouse'
          target='_blank'
          rel='noreferrer'
          className='text-indigo-500 underline cursor-none'
        >
          GitHub
        </a>.
      </p>
    </div>
  )
}

export default SmartMouseDemo
