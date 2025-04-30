import { Component, ElementRef, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface FarmField {
  id: string;
  position: { x: number; z: number };
  dimensions: { width: number; length: number };
}

@Component({
  selector: 'app-farm3d',
  templateUrl: './farm3d.component.html',
  styleUrls: ['./farm3d.component.css']
})
export class Farm3DComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;
  @Input() farmData: any;
  selectedField: FarmField | null = null;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  ngOnInit(): void {
    this.initThreeJS();
    this.createFarmModel();
    this.animate();
  }

  ngOnChanges(): void {
    if (this.farmData) {
      this.createFarmModel();
    }
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeaf7ea);

    const { clientWidth, clientHeight } = this.canvasRef.nativeElement;
    const aspectRatio = clientWidth / clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 60, 60);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true
    });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.shadowMap.enabled = true;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.addLighting();
    this.handleResize();

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private addLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0aa, 1);
    sunLight.position.set(50, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.scene.add(sunLight);

    const sunSphere = new THREE.Mesh(
      new THREE.SphereGeometry(2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffdd33 })
    );
    sunSphere.position.copy(sunLight.position);
    this.scene.add(sunSphere);
  }

  private handleResize(): void {
    const { clientWidth, clientHeight } = this.canvasRef.nativeElement;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  private createFarmModel(): void {
    this.scene.children
      .filter(obj => obj.type !== 'AmbientLight' && obj.type !== 'DirectionalLight' && obj.type !== 'PerspectiveCamera')
      .forEach(obj => this.scene.remove(obj));

    this.addLighting();

    if (!this.farmData || !this.farmData.fields?.length) {
      this.createDefaultFarm();
    } else {
      this.createFromData();
    }

    this.camera.position.set(0, 60, 60);
    this.camera.lookAt(0, 0, 0);
  }

  private addGround(material: THREE.Material): void {
    const groundGeometry = new THREE.PlaneGeometry(200, 200); // Increased size to cover all elements
    const groundTexture = new THREE.TextureLoader().load('assets/images/new-grass-texture.jpg', (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 20); // Adjusted repeat to match the larger ground size
    }, undefined, (err) => {
      console.error('Error loading ground texture:', err);
      // Fallback to a solid green color if texture fails to load
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);
    });

    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private createDefaultFarm(): void {
    const loader = new THREE.TextureLoader();
    loader.load(
      'assets/images/new-grass-texture.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
        this.addGround(groundMaterial);
      },
      undefined,
      (err) => {
        console.error('Error loading texture:', err);
        const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        this.addGround(fallbackMaterial);
      }
    );

    for (let i = 0; i < 10; i++) {
      const x = -80 + i * 16;
      this.createTree(x, 3, -80 + (i % 2) * 10);
    }

    for (let i = 0; i < 50; i++) {
      const wheat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xffe066 })
      );
      wheat.position.set(-30 + (i % 10) * 2, 0.6, -10 + Math.floor(i / 10) * 2);
      wheat.castShadow = true;
      this.scene.add(wheat);
    }

    for (let i = 0; i < 6; i++) {
      const baseX = 30;
      const baseZ = -15 + i * 5;

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      stem.position.set(baseX, 0.75, baseZ);
      stem.castShadow = true;
      this.scene.add(stem);

      const tomato = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xff6347 })
      );
      tomato.position.set(baseX, 1.5, baseZ);
      tomato.castShadow = true;
      this.scene.add(tomato);
    }

    const barn = new THREE.Mesh(
      new THREE.BoxGeometry(10, 7, 10),
      new THREE.MeshStandardMaterial({ color: 0x9b111e })
    );
    barn.position.set(0, 3.5, 60);
    barn.castShadow = true;
    this.scene.add(barn);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(7.5, 4, 4),
      new THREE.MeshStandardMaterial({ color: 0x5a2a27 })
    );
    roof.position.set(0, 8.5, 60);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    this.scene.add(roof);

    const well = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0x708090 })
    );
    well.position.set(-50, 0.5, 50);
    well.castShadow = true;
    this.scene.add(well);

    for (let x = -100; x <= 100; x += 10) {
      this.createFencePost(x, -100);
      this.createFencePost(x, 100);
    }
    for (let z = -90; z <= 90; z += 10) {
      this.createFencePost(-100, z);
      this.createFencePost(100, z);
    }
  }

  private createFromData(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.farmData.fields.forEach((field: any) => {
      const fieldGeometry = new THREE.PlaneGeometry(field.dimensions.width, field.dimensions.length);
      const fieldMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
      fieldMesh.rotation.x = -Math.PI / 2;
      fieldMesh.position.set(field.position.x, 0.1, field.position.z);
      fieldMesh.receiveShadow = true;
      this.scene.add(fieldMesh);

      if (field.crops) {
        field.crops.forEach((crop: any) => {
          const cropGeometry = new THREE.BoxGeometry(1, crop.height, 1);
          const cropMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // brown
          const cropMesh = new THREE.Mesh(cropGeometry, cropMaterial);
          cropMesh.position.set(
            field.position.x + crop.offsetX,
            crop.height / 2,
            field.position.z + crop.offsetZ
          );
          cropMesh.castShadow = true;
          this.scene.add(cropMesh);
        });
      }
    });
  }

  private createTree(x: number, y: number, z: number): void {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 3, 12),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    trunk.position.set(x, 1.5, z);
    trunk.castShadow = true;
    this.scene.add(trunk);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x2e8b57 })
    );
    leaves.position.set(x, 4, z);
    leaves.castShadow = true;
    this.scene.add(leaves);
  }

  private createFencePost(x: number, z: number): void {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 2, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );
    post.position.set(x, 1, z);
    post.castShadow = true;
    this.scene.add(post);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
