const g = require('./threeGlobals');
const cnf = require('./config');

const clipPresets = {
  'test': {
    tracks: [
      new THREE.VectorKeyframeTrack(
        '.position',
        [0, 1, 2],
        [0, 0, 0, 200, 0, 0, 0, 0, 0]
      )
    ],
    duration: 3
  },

  'rotate': {
    tracks: [
      (() => {
        
				var xAxis = new THREE.Vector3(0,1,0);
				var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
				var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );

        return new THREE.QuaternionKeyframeTrack(
          '.quaternion',
          [0, 1, 2],
          [
            qInitial.x, qInitial.y, qInitial.z, qInitial.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            qInitial.x, qInitial.y, qInitial.z, qInitial.w
          ] 
        );
      })()

    ],
    duration: 3
  }
}


const clips = {};
for (let clipName in clipPresets) {
  var preset = clipPresets[clipName];
  var clip = new THREE.AnimationClip(
    clipName,
    preset.duration,
    preset.tracks
  );
  clips[clipName] = clip;
}

module.exports = clips;
