import {Config} from '@remotion/cli/config';

// Master-quality defaults. Destination files are made from the master by
// scripts/encode.sh, never by re-rendering. See docs/playbook.md "Rendering".
Config.setVideoImageFormat('png');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
