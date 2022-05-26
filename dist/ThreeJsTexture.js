/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
import { BlendMode, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";
import * as THREE from "three";
export class ThreeJsTexture extends Texture {
    constructor(image) {
        super(image);
        this.texture = new THREE.Texture(image);
        this.texture.flipY = false;
        this.texture.needsUpdate = true;
    }
    setFilters(minFilter, magFilter) {
        this.texture.minFilter = ThreeJsTexture.toThreeJsTextureFilter(minFilter);
        this.texture.magFilter = ThreeJsTexture.toThreeJsTextureFilter(magFilter);
    }
    setWraps(uWrap, vWrap) {
        this.texture.wrapS = ThreeJsTexture.toThreeJsTextureWrap(uWrap);
        this.texture.wrapT = ThreeJsTexture.toThreeJsTextureWrap(vWrap);
    }
    dispose() {
        this.texture.dispose();
    }
    static toThreeJsTextureFilter(filter) {
        if (filter === TextureFilter.Linear)
            return THREE.LinearFilter;
        else if (filter === TextureFilter.MipMap)
            return THREE.LinearMipMapLinearFilter; // also includes TextureFilter.MipMapLinearLinear
        else if (filter === TextureFilter.MipMapLinearNearest)
            return THREE.LinearMipMapNearestFilter;
        else if (filter === TextureFilter.MipMapNearestLinear)
            return THREE.NearestMipMapLinearFilter;
        else if (filter === TextureFilter.MipMapNearestNearest)
            return THREE.NearestMipMapNearestFilter;
        else if (filter === TextureFilter.Nearest)
            return THREE.NearestFilter;
        else
            throw new Error("Unknown texture filter: " + filter);
    }
    static toThreeJsTextureWrap(wrap) {
        if (wrap === TextureWrap.ClampToEdge)
            return THREE.ClampToEdgeWrapping;
        else if (wrap === TextureWrap.MirroredRepeat)
            return THREE.MirroredRepeatWrapping;
        else if (wrap === TextureWrap.Repeat)
            return THREE.RepeatWrapping;
        else
            throw new Error("Unknown texture wrap: " + wrap);
    }
    static toThreeJsBlending(blend) {
        if (blend === BlendMode.Normal)
            return THREE.NormalBlending;
        else if (blend === BlendMode.Additive)
            return THREE.AdditiveBlending;
        else if (blend === BlendMode.Multiply)
            return THREE.MultiplyBlending;
        else if (blend === BlendMode.Screen)
            return THREE.CustomBlending;
        else
            throw new Error("Unknown blendMode: " + blend);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyZWVKc1RleHR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyZWVKc1RleHR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRUEyQitFO0FBRS9FLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RixPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUvQixNQUFNLE9BQU8sY0FBZSxTQUFRLE9BQU87SUFHMUMsWUFBYSxLQUF1QjtRQUNuQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxVQUFVLENBQUUsU0FBd0IsRUFBRSxTQUF3QjtRQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsY0FBYyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxRQUFRLENBQUUsS0FBa0IsRUFBRSxLQUFrQjtRQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxPQUFPO1FBQ04sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUFFLE1BQXFCO1FBQ25ELElBQUksTUFBTSxLQUFLLGFBQWEsQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDO2FBQzFELElBQUksTUFBTSxLQUFLLGFBQWEsQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxpREFBaUQ7YUFDN0gsSUFBSSxNQUFNLEtBQUssYUFBYSxDQUFDLG1CQUFtQjtZQUFFLE9BQU8sS0FBSyxDQUFDLHlCQUF5QixDQUFDO2FBQ3pGLElBQUksTUFBTSxLQUFLLGFBQWEsQ0FBQyxtQkFBbUI7WUFBRSxPQUFPLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQzthQUN6RixJQUFJLE1BQU0sS0FBSyxhQUFhLENBQUMsb0JBQW9CO1lBQUUsT0FBTyxLQUFLLENBQUMsMEJBQTBCLENBQUM7YUFDM0YsSUFBSSxNQUFNLEtBQUssYUFBYSxDQUFDLE9BQU87WUFBRSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUM7O1lBQ2pFLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBRSxJQUFpQjtRQUM3QyxJQUFJLElBQUksS0FBSyxXQUFXLENBQUMsV0FBVztZQUFFLE9BQU8sS0FBSyxDQUFDLG1CQUFtQixDQUFDO2FBQ2xFLElBQUksSUFBSSxLQUFLLFdBQVcsQ0FBQyxjQUFjO1lBQUUsT0FBTyxLQUFLLENBQUMsc0JBQXNCLENBQUM7YUFDN0UsSUFBSSxJQUFJLEtBQUssV0FBVyxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUM7O1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBRSxLQUFnQjtRQUN6QyxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQzthQUN2RCxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsUUFBUTtZQUFFLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixDQUFDO2FBQ2hFLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxRQUFRO1lBQUUsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7YUFDaEUsSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUM7O1lBQzVELE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztDQUNEIn0=