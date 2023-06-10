(()=>{var ae={694:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>b});var a=s(537),o=s.n(a),l=s(645),g=s.n(l),_=g()(o());_.push([e.id,`
#compute-grid[data-v-6c191c15] {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'size vpc'
        'timeout volume';
    gap: 16px 24px;
}
#edit-compute-settings[data-v-6c191c15] {
    margin-top: 16px;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/compute.vue"],names:[],mappings:";AA2JA;IACI,aAAa;IACb,qBAAqB;IACrB;;wBAEoB;IACpB,cAAc;AAClB;AACA;IACI,gBAAgB;AACpB",sourcesContent:[`<template>
    <div>
        <div id="compute-grid">
            <div id="size" style="grid-area: size">
                <div>
                    <span class="label-context soft">Compute</span>
                    <b>{{ instance.name }}</b
                    ><br />
                    {{ instance.specs }}
                </div>
                <button
                    type="button"
                    id="edit-size"
                    class="button-theme-secondary mt-8"
                    @click="$emit('editSettings', 'instanceType')"
                >
                    Edit Compute
                </button>
            </div>
            <div id="timeout" style="grid-area: timeout">
                <div>
                    <span class="label-context soft">Timeout</span>
                    <b>{{ timeout }}</b>
                </div>
                <button
                    type="button"
                    id="edit-timeout"
                    class="button-theme-secondary mt-8"
                    @click="$emit('editSettings', 'inactivityTimeoutMinutes')"
                >
                    Edit Timeout
                </button>
            </div>
            <div id="volume" style="grid-area: volume">
                <span class="label-context soft">Storage</span>
                <b>{{ storage }}</b>
                <p class="mt-0 mb-0" v-if="mode === 'update'">{{ readonlyText }}</p>
                <div v-else>
                    <button
                        type="button"
                        id="edit-storage"
                        class="button-theme-secondary mt-8"
                        @click="$emit('editSettings', 'persistentStorage')"
                    >
                        Edit Storage Size
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WebviewClientFactory } from '../../webviews/client'
import saveData from '../../webviews/mixins/saveData'
import { createClass, createType } from '../../webviews/util'
import { DevEnvironmentSettings } from '../commands'
import { CodeCatalystConfigureWebview } from './configure/backend'
import { CodeCatalystCreateWebview } from './create/backend'

const client = WebviewClientFactory.create<CodeCatalystConfigureWebview | CodeCatalystCreateWebview>()

const DEFAULT_COMPUTE_SETTINGS = {
    inactivityTimeoutMinutes: 15,
    instanceType: 'dev.standard1.small',
    persistentStorage: { sizeInGiB: 16 },
}

export const VueModel = createClass(DEFAULT_COMPUTE_SETTINGS)

export default defineComponent({
    name: 'compute-panel',
    props: {
        modelValue: {
            type: createType(VueModel),
            default: new VueModel(),
        },
        mode: {
            type: String as PropType<'create' | 'update'>,
            default: 'update',
        },
    },
    data() {
        return {
            changed: {} as Record<keyof DevEnvironmentSettings, boolean>,
            readonlyText: "Can't be changed after creation.",
            descriptions: {} as Record<string, { name: string; specs: string } | undefined>,
            originalData: undefined as typeof this.modelValue | undefined,
        }
    },
    mixins: [saveData],
    created() {
        client.getAllInstanceDescriptions().then(desc => (this.descriptions = desc))
    },
    watch: {
        model(settings?: DevEnvironmentSettings) {
            if (settings === undefined || this.originalData === undefined) {
                return
            }

            for (const [k, v] of Object.entries(settings)) {
                // TODO: use deep compare instead of strict so storage size works
                this.changed[k as keyof DevEnvironmentSettings] =
                    this.originalData[k as keyof typeof this.originalData] !== v
            }
        },
        modelValue() {
            this.originalData ??= this.modelValue
        },
    },
    methods: {
        getNeedsRestartText(key: keyof DevEnvironmentSettings) {
            return this.mode === 'update' && this.changed[key] ? ' (needs restart)' : ''
        },
    },
    computed: {
        model() {
            return this.modelValue
        },
        instance() {
            const type = this.model.instanceType
            const desc = this.descriptions[type] ? { ...this.descriptions[type] } : { name: '', specs: '' }
            const suffix =
                this.getNeedsRestartText('instanceType') ||
                (type === DEFAULT_COMPUTE_SETTINGS.instanceType ? ' (default)' : '')

            desc.name = \`\${desc.name}\${suffix}\`

            return desc
        },
        timeout() {
            const time = this.model.inactivityTimeoutMinutes
            const timeDesc = \`\${time} minutes\`
            const suffix =
                this.getNeedsRestartText('inactivityTimeoutMinutes') ||
                (time === DEFAULT_COMPUTE_SETTINGS.inactivityTimeoutMinutes ? ' (default)' : '')

            return \`\${timeDesc}\${suffix}\`
        },
        storage() {
            const storage = this.model.persistentStorage.sizeInGiB
            const storageDesc = \`\${storage} GB\`
            const suffix = storage === DEFAULT_COMPUTE_SETTINGS.persistentStorage.sizeInGiB ? ' (default)' : ''

            return \`\${storageDesc}\${suffix}\`
        },
    },
    emits: {
        editSettings: (key: keyof DevEnvironmentSettings) => key !== undefined,
    },
})
<\/script>

<style scoped>
#compute-grid {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'size vpc'
        'timeout volume';
    gap: 16px 24px;
}
#edit-compute-settings {
    margin-top: 16px;
}
</style>
`],sourceRoot:""}]);const b=_},771:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>b});var a=s(537),o=s.n(a),l=s(645),g=s.n(l),_=g()(o());_.push([e.id,`
html {
    overflow-y: scroll;
}
body {
    padding-right: 12px;
    max-width: 700px;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/create/root.vue"],names:[],mappings:";AAuHA;IACI,kBAAkB;AACtB;AACA;IACI,mBAAmB;IACnB,gBAAgB;AACpB",sourcesContent:[`<template>
    <div id="configure-header">
        <h1>Create a CodeCatalyst Dev Environment</h1>
        <!--TODO: add link-->
        <span style="font-size: 0.95em">
            Create an on-demand AWS instance to work on your code in the cloud.
            <a href="https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/codecatalyst-devenvironment.html">
                Learn more about CodeCatalyst Dev Environments.
            </a>
        </span>
    </div>

    <settings-panel id="source-panel" title="Source Code">
        <source-panel v-model="source"></source-panel>
    </settings-panel>
    <settings-panel
        id="alias-panel"
        title="Alias"
        description="Enter an alias to identify the Dev Environment. (Optional but recommended)"
    >
        <label class="options-label soft mb-8" style="display: block" for="alias-input">Alias</label>
        <input id="alias-input" type="text" v-model="alias" />
    </settings-panel>

    <settings-panel
        id="configuration-panel"
        title="Dev Environment Configuration"
        description="All settings except Storage can be changed in settings after creation."
    >
        <compute-panel v-model="compute" mode="create" @edit-settings="editCompute"></compute-panel>
    </settings-panel>

    <div id="submit-buttons" class="mb-16">
        <button class="button-theme-secondary" @click="cancel" :disabled="creating">Cancel</button>

        <button @click="submit" :disabled="!canCreate">
            {{ creating ? 'Creating...' : 'Create Dev Environment' }}
        </button>
    </div>
</template>

<script lang="ts">
import computePanel, { VueModel as ComputeModel } from '../compute.vue'
import sourcePanel, { isValidSource, VueModel as SourceModel } from './source.vue'
import settingsPanel from '../../../webviews/components/settingsPanel.vue'
import { defineComponent } from 'vue'
import { CodeCatalystCreateWebview } from './backend'
import { WebviewClientFactory } from '../../../webviews/client'
import saveData from '../../../webviews/mixins/saveData'
import { DevEnvironmentSettings } from '../../commands'

const client = WebviewClientFactory.create<CodeCatalystCreateWebview>()

const model = {
    source: new SourceModel(),
    compute: new ComputeModel(),
    creating: false,
    alias: '',
}

export default defineComponent({
    name: 'create',
    components: {
        settingsPanel,
        computePanel,
        sourcePanel,
    },
    mixins: [saveData],
    data() {
        return model
    },
    computed: {
        canCreate() {
            return !this.creating && isValidSource(this.source)
        },
    },
    created() {},
    watch: {
        'source.selectedProject'() {
            this.compute = new ComputeModel()
        },
    },
    methods: {
        async editCompute(key: keyof DevEnvironmentSettings) {
            const current = { ...this.compute, alias: this.alias }
            const resp = await client.editSetting(current, key, this.source.selectedProject?.org)

            if (key !== 'alias') {
                this.compute = new ComputeModel(resp)
            } else if (resp.alias !== undefined) {
                this.alias = resp.alias
            }
        },
        async submit() {
            if (!this.canCreate || !isValidSource(this.source)) {
                return
            }

            this.creating = true
            try {
                const settings = { ...this.compute, alias: this.alias }
                await client.submit(settings, this.source)
                client.close()
            } catch (err) {
                if (!(err as Error).message.match(/cancelled/i)) {
                    client.showLogsMessage(\`Failed to create Dev Environment: \${(err as Error).message}\`)
                }
            } finally {
                this.creating = false
            }
        },
        cancel() {
            client.close()
        },
    },
})
<\/script>

<style>
html {
    overflow-y: scroll;
}
body {
    padding-right: 12px;
    max-width: 700px;
}
</style>

<style scoped>
#configure-header {
    padding: 16px 0 0 0;
    background-color: var(--vscode-editor-background);
    z-index: 1;
    position: relative;
}
#alias-input {
    min-width: 300px;
}
#submit-buttons {
    display: flex;
    justify-content: end;
    column-gap: 16px;
}
</style>
`],sourceRoot:""}]);const b=_},527:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>b});var a=s(537),o=s.n(a),l=s(645),g=s.n(l),_=g()(o());_.push([e.id,`
#configure-header[data-v-3bb2cf6f] {
    padding: 16px 0 0 0;
    background-color: var(--vscode-editor-background);
    z-index: 1;
    position: relative;
}
#alias-input[data-v-3bb2cf6f] {
    min-width: 300px;
}
#submit-buttons[data-v-3bb2cf6f] {
    display: flex;
    justify-content: end;
    column-gap: 16px;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/create/root.vue"],names:[],mappings:";AAiIA;IACI,mBAAmB;IACnB,iDAAiD;IACjD,UAAU;IACV,kBAAkB;AACtB;AACA;IACI,gBAAgB;AACpB;AACA;IACI,aAAa;IACb,oBAAoB;IACpB,gBAAgB;AACpB",sourcesContent:[`<template>
    <div id="configure-header">
        <h1>Create a CodeCatalyst Dev Environment</h1>
        <!--TODO: add link-->
        <span style="font-size: 0.95em">
            Create an on-demand AWS instance to work on your code in the cloud.
            <a href="https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/codecatalyst-devenvironment.html">
                Learn more about CodeCatalyst Dev Environments.
            </a>
        </span>
    </div>

    <settings-panel id="source-panel" title="Source Code">
        <source-panel v-model="source"></source-panel>
    </settings-panel>
    <settings-panel
        id="alias-panel"
        title="Alias"
        description="Enter an alias to identify the Dev Environment. (Optional but recommended)"
    >
        <label class="options-label soft mb-8" style="display: block" for="alias-input">Alias</label>
        <input id="alias-input" type="text" v-model="alias" />
    </settings-panel>

    <settings-panel
        id="configuration-panel"
        title="Dev Environment Configuration"
        description="All settings except Storage can be changed in settings after creation."
    >
        <compute-panel v-model="compute" mode="create" @edit-settings="editCompute"></compute-panel>
    </settings-panel>

    <div id="submit-buttons" class="mb-16">
        <button class="button-theme-secondary" @click="cancel" :disabled="creating">Cancel</button>

        <button @click="submit" :disabled="!canCreate">
            {{ creating ? 'Creating...' : 'Create Dev Environment' }}
        </button>
    </div>
</template>

<script lang="ts">
import computePanel, { VueModel as ComputeModel } from '../compute.vue'
import sourcePanel, { isValidSource, VueModel as SourceModel } from './source.vue'
import settingsPanel from '../../../webviews/components/settingsPanel.vue'
import { defineComponent } from 'vue'
import { CodeCatalystCreateWebview } from './backend'
import { WebviewClientFactory } from '../../../webviews/client'
import saveData from '../../../webviews/mixins/saveData'
import { DevEnvironmentSettings } from '../../commands'

const client = WebviewClientFactory.create<CodeCatalystCreateWebview>()

const model = {
    source: new SourceModel(),
    compute: new ComputeModel(),
    creating: false,
    alias: '',
}

export default defineComponent({
    name: 'create',
    components: {
        settingsPanel,
        computePanel,
        sourcePanel,
    },
    mixins: [saveData],
    data() {
        return model
    },
    computed: {
        canCreate() {
            return !this.creating && isValidSource(this.source)
        },
    },
    created() {},
    watch: {
        'source.selectedProject'() {
            this.compute = new ComputeModel()
        },
    },
    methods: {
        async editCompute(key: keyof DevEnvironmentSettings) {
            const current = { ...this.compute, alias: this.alias }
            const resp = await client.editSetting(current, key, this.source.selectedProject?.org)

            if (key !== 'alias') {
                this.compute = new ComputeModel(resp)
            } else if (resp.alias !== undefined) {
                this.alias = resp.alias
            }
        },
        async submit() {
            if (!this.canCreate || !isValidSource(this.source)) {
                return
            }

            this.creating = true
            try {
                const settings = { ...this.compute, alias: this.alias }
                await client.submit(settings, this.source)
                client.close()
            } catch (err) {
                if (!(err as Error).message.match(/cancelled/i)) {
                    client.showLogsMessage(\`Failed to create Dev Environment: \${(err as Error).message}\`)
                }
            } finally {
                this.creating = false
            }
        },
        cancel() {
            client.close()
        },
    },
})
<\/script>

<style>
html {
    overflow-y: scroll;
}
body {
    padding-right: 12px;
    max-width: 700px;
}
</style>

<style scoped>
#configure-header {
    padding: 16px 0 0 0;
    background-color: var(--vscode-editor-background);
    z-index: 1;
    position: relative;
}
#alias-input {
    min-width: 300px;
}
#submit-buttons {
    display: flex;
    justify-content: end;
    column-gap: 16px;
}
</style>
`],sourceRoot:""}]);const b=_},154:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>b});var a=s(537),o=s.n(a),l=s(645),g=s.n(l),_=g()(o());_.push([e.id,`
.picker {
    min-width: 300px;
    width: 100%;
    box-sizing: border-box;
}
.source-pickers {
    margin-top: 16px;
    display: flex;
    flex-flow: wrap;
    column-gap: 16px;
}
.modes {
    display: flex;
    column-gap: 16px;
}
.flex-sizing {
    flex: 1;
}
.mode-container {
    display: flex;
    flex: 1;
    border: 1px solid gray;
    padding: 8px;
    max-width: calc((1 / 3 * 100%) - (2 / 3 * 32px));
    align-items: center;
}
.config-item {
    display: inline;
    margin-left: 8px;
}
.mode-container[data-disabled='false'] {
    border: 1px solid var(--vscode-focusBorder);
}
body.vscode-dark .mode-container[data-disabled='true'] .config-item {
    filter: brightness(0.8);
}
body.vscode-light .mode-container[data-disabled='true'] .config-item {
    filter: brightness(1.2);
}
#repository-url {
    min-width: 300px;
}
#branch-input {
    min-width: 300px;
    width: 100%;
    box-sizing: border-box;
}
.project-button {
    background-color: transparent;
    padding-left: 0;
    padding-right: 0;
    font-weight: bold;
}
.edit-icon {
    color: #0078d7;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/create/source.vue"],names:[],mappings:";AAwRA;IACI,gBAAgB;IAChB,WAAW;IACX,sBAAsB;AAC1B;AAEA;IACI,gBAAgB;IAChB,aAAa;IACb,eAAe;IACf,gBAAgB;AACpB;AAEA;IACI,aAAa;IACb,gBAAgB;AACpB;AAEA;IACI,OAAO;AACX;AAEA;IACI,aAAa;IACb,OAAO;IACP,sBAAsB;IACtB,YAAY;IACZ,gDAAgD;IAChD,mBAAmB;AACvB;AAEA;IACI,eAAe;IACf,gBAAgB;AACpB;AAEA;IACI,2CAA2C;AAC/C;AAEA;IACI,uBAAuB;AAC3B;AAEA;IACI,uBAAuB;AAC3B;AAEA;IACI,gBAAgB;AACpB;AAEA;IACI,gBAAgB;IAChB,WAAW;IACX,sBAAsB;AAC1B;AAEA;IACI,6BAA6B;IAC7B,eAAe;IACf,gBAAgB;IAChB,iBAAiB;AACrB;AAEA;IACI,cAAc;AAClB",sourcesContent:[`<template>
    <div class="modes mb-16">
        <label class="mode-container" :data-disabled="model.type !== 'linked'">
            <input class="radio" type="radio" name="mode" id="from-code-catalyst" v-model="model.type" value="linked" />
            <span class="ml-8 option-label" style="padding: 0px">Use an existing CodeCatalyst repository</span>
        </label>

        <label class="mode-container" :data-disabled="model.type !== 'none'">
            <input class="radio" type="radio" name="mode" id="from-none" v-model="model.type" value="none" />
            <span class="ml-8 option-label" style="padding: 0px">Create an empty Dev Environment</span>
        </label>
    </div>

    <div class="source-pickers" v-if="model.type === 'linked'">
        <div class="modes flex-sizing mt-16">
            <span class="flex-sizing mt-8">
                <label class="option-label soft">Space</label>
                <button class="project-button" @click="quickPickSpace()">
                    {{ selectedSpaceName }}
                    <span class="icon icon-lg icon-vscode-edit edit-icon"></span>
                </button>
            </span>

            <span class="flex-sizing mt-8">
                <label class="option-label soft">Project</label>
                <button class="project-button" @click="quickPickProject()" :disabled="!isSpaceSelected">
                    {{ selectedProjectName }}
                    <span class="icon icon-lg icon-vscode-edit edit-icon"></span>
                </button>
            </span>
        </div>

        <div class="modes flex-sizing mt-16">
            <!-- Existing branch -->
            <span class="flex-sizing">
                <label class="options-label soft mb-8" style="display: block" for="branch-picker">Branch</label>
                <select
                    id="branch-picker"
                    class="picker"
                    :disabled="!model.selectedProject"
                    v-model="model.selectedBranch"
                    @input="update"
                >
                    <option disabled :value="undefined">{{ branchPlaceholder }}</option>
                    <option v-for="branch in availableBranches" :key="branch.id" :value="branch">
                        {{ branchName(branch) }}
                    </option>
                </select>
            </span>

            <!-- New Branch -->
            <span class="flex-sizing">
                <label class="options-label soft mb-8" style="display: block" for="branch-input"
                    >Create Branch - Optional for CodeCatalyst Repos</label
                >
                <input
                    id="branch-input"
                    type="text"
                    :placeholder="newBranchNamePlaceholder"
                    :disabled="!newBranchNameAllowed"
                    v-model="model.newBranch"
                    @input="update"
                />

                <div class="input-validation" v-if="branchError">{{ branchError }}</div>
            </span>
        </div>
    </div>

    <div class="source-pickers" v-if="model.type === 'none'">
        <div class="modes flex-sizing mt-16">
            <span class="flex-sizing mt-8">
                <label class="option-label soft">Space</label>
                <button class="project-button" @click="quickPickSpace()">
                    {{ selectedSpaceName }}
                    <span class="icon icon-lg icon-vscode-edit edit-icon"></span>
                </button>
            </span>

            <span class="flex-sizing mt-8">
                <label class="option-label soft">Project</label>
                <button class="project-button" @click="quickPickProject()" :disabled="!isSpaceSelected">
                    {{ selectedProjectName }}
                    <span class="icon icon-lg icon-vscode-edit edit-icon"></span>
                </button>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CodeCatalystBranch, CodeCatalystProject } from '../../../shared/clients/codecatalystClient'
import { WebviewClientFactory } from '../../../webviews/client'
import { createClass, createType } from '../../../webviews/util'
import { CodeCatalystCreateWebview, SourceResponse } from './backend'

const client = WebviewClientFactory.create<CodeCatalystCreateWebview>()

type SourceModel = Partial<SourceResponse & { branchError: string }>

export function isValidSource(source: SourceModel): source is SourceResponse {
    if (source.type === 'linked') {
        return !!source.selectedProject && !!source.selectedBranch && !source.branchError
    } else if (source.type === 'none') {
        return !!source.selectedProject
    }

    return false
}

export const VueModel = createClass<SourceModel>({ type: 'linked' })

export default defineComponent({
    name: 'source-code',
    props: {
        modelValue: {
            type: createType(VueModel),
            default: new VueModel(),
        },
    },
    data() {
        return {
            projects: [] as CodeCatalystProject[],
            branches: {} as Record<string, CodeCatalystBranch[] | undefined>,
            loadingProjects: false,
            loadingBranches: {} as Record<string, boolean | undefined>,
            newBranchNameAllowed: false,
            newBranchNamePlaceholder: 'Select branch first...',
        }
    },
    async created() {
        this.loadingProjects = true
    },
    watch: {
        async 'model.selectedProject'(project?: CodeCatalystProject) {
            this.useFirstBranch()

            if (project && !this.branches[project.name]) {
                this.loadingBranches[project.name] = true
                this.branches[project.name] ??= await client.getBranches(project).finally(() => {
                    this.loadingBranches[project.name] = false
                })
                this.useFirstBranch()
            }
        },
        async 'model.selectedBranch'(branch?: CodeCatalystBranch) {
            if (this.model.type !== 'linked' || branch === undefined) {
                this.newBranchNameAllowed = false
                this.newBranchNamePlaceholder = ''
                return
            }

            // Disable user input for new branch name while calculating
            this.newBranchNameAllowed = false
            this.newBranchNamePlaceholder = 'Loading...'

            // Clear the existing new branch value so user does not see it
            const previousNewBranch = this.model.newBranch
            this.$emit('update:modelValue', { ...this.model, newBranch: undefined })

            // Only want to allow users to set a branch name if first party repo
            const isThirdPartyRepo = await client.isThirdPartyRepo({
                spaceName: branch.org.name,
                projectName: branch.project.name,
                sourceRepositoryName: branch.repo.name,
            })
            if (isThirdPartyRepo) {
                this.newBranchNamePlaceholder = 'Not Applicable for Linked Repo'
                this.newBranchNameAllowed = false
                // Clear the new branch in case one was already selected
                this.$emit('update:modelValue', { ...this.model, newBranch: undefined })
            } else {
                // First Party
                this.newBranchNamePlaceholder = 'branch-name'
                this.newBranchNameAllowed = true
                // Since this can have a new branch, set this back to what it previously was
                this.$emit('update:modelValue', { ...this.model, newBranch: previousNewBranch })
            }
        },
    },
    computed: {
        model() {
            return this.modelValue
        },
        loading() {
            if (this.model.type !== 'linked' || !this.model.selectedProject) {
                return false
            }

            return this.loadingBranches[this.model.selectedProject.name] ?? false
        },
        branchPlaceholder() {
            if (this.loading) {
                return 'Loading...'
            }

            return (this.availableBranches?.length ?? 0) === 0 ? 'No branches found' : 'Select a branch'
        },
        availableBranches() {
            if (this.model.type !== 'linked' || !this.model.selectedProject) {
                return []
            }

            return this.branches[this.model.selectedProject.name]
        },
        branchError() {
            if (this.model.type !== 'linked' || !this.model.newBranch) {
                return
            }

            const branch = this.model.newBranch
            if (!!branch && this.availableBranches?.find(b => b.name === \`refs/heads/\${branch}\`) !== undefined) {
                return 'Branch already exists'
            }
        },
        isSpaceSelected() {
            return !!this.model.selectedSpace
        },
        isProjectSelected() {
            return !!this.model.selectedProject
        },
        selectedSpaceName() {
            if (this.model.selectedSpace === undefined) {
                return 'Not Selected'
            }
            return this.model.selectedSpace.name
        },
        selectedProjectName() {
            if (this.model.selectedProject === undefined) {
                return 'Not Selected'
            }
            return this.model.selectedProject.name
        },
    },
    methods: {
        update() {
            this.model.branchError = this.branchError
            this.$emit('update:modelValue', this.model)
        },
        branchName(branch: CodeCatalystBranch) {
            return \`\${branch.repo.name} / \${branch.name.replace('refs/heads/', '')}\`
        },
        useFirstBranch() {
            if (this.model.type !== 'linked') {
                return
            }

            Object.assign<typeof this.model, Partial<SourceModel>>(this.model, {
                selectedBranch: this.availableBranches?.[0],
            })
            this.update()
        },
        async quickPickSpace() {
            const space = await client.quickPickSpace()
            if (space === undefined) {
                return
            }
            this.$emit('update:modelValue', { ...this.modelValue, selectedSpace: space, selectedProject: undefined })
        },
        async quickPickProject() {
            const selectedSpace = this.modelValue.selectedSpace
            if (selectedSpace === undefined) {
                return
            }

            const project = await client.quickPickProject(selectedSpace.name)
            if (project === undefined) {
                return
            }
            this.$emit('update:modelValue', { ...this.modelValue, selectedProject: project })
        },
    },
    emits: {
        'update:modelValue': (value: InstanceType<typeof VueModel>) => true,
    },
})
<\/script>

<style scope>
.picker {
    min-width: 300px;
    width: 100%;
    box-sizing: border-box;
}

.source-pickers {
    margin-top: 16px;
    display: flex;
    flex-flow: wrap;
    column-gap: 16px;
}

.modes {
    display: flex;
    column-gap: 16px;
}

.flex-sizing {
    flex: 1;
}

.mode-container {
    display: flex;
    flex: 1;
    border: 1px solid gray;
    padding: 8px;
    max-width: calc((1 / 3 * 100%) - (2 / 3 * 32px));
    align-items: center;
}

.config-item {
    display: inline;
    margin-left: 8px;
}

.mode-container[data-disabled='false'] {
    border: 1px solid var(--vscode-focusBorder);
}

body.vscode-dark .mode-container[data-disabled='true'] .config-item {
    filter: brightness(0.8);
}

body.vscode-light .mode-container[data-disabled='true'] .config-item {
    filter: brightness(1.2);
}

#repository-url {
    min-width: 300px;
}

#branch-input {
    min-width: 300px;
    width: 100%;
    box-sizing: border-box;
}

.project-button {
    background-color: transparent;
    padding-left: 0;
    padding-right: 0;
    font-weight: bold;
}

.edit-icon {
    color: #0078d7;
}
</style>
`],sourceRoot:""}]);const b=_},306:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>b});var a=s(537),o=s.n(a),l=s(645),g=s.n(l),_=g()(o());_.push([e.id,`
.preload-transition[data-v-3858c4ad] {
    transition: none !important;
}
.settings-title[data-v-3858c4ad] {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane[data-v-3858c4ad] {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
[data-v-3858c4ad] .sub-pane div:first-child {
    margin-top: 0;
}
.collapse-leave-from[data-v-3858c4ad] {
    max-height: var(--max-height);
}
.collapse-leave-active[data-v-3858c4ad] {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active[data-v-3858c4ad] {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to[data-v-3858c4ad] {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button[data-v-3858c4ad] {
    display: none;
}
input[type='checkbox'] ~ label .collapse-button[data-v-3858c4ad] {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}
input[type='checkbox']:checked ~ label .collapse-button[data-v-3858c4ad] {
    transform: rotate(90deg);
}
.settings-panel[data-v-3858c4ad] {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
.panel-header[data-v-3858c4ad] {
    display: flex;
    align-items: center;
    width: 100%;
}
`,"",{version:3,sources:["webpack://./src/webviews/components/settingsPanel.vue"],names:[],mappings:";AA4FA;IACI,2BAA2B;AAC/B;AACA;IACI,8CAA8C,EAAE,iCAAiC;IACjF,iBAAiB;IACjB,SAAS;IACT,UAAU;AACd;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,gBAAgB;AACpB;AACA;IACI,aAAa;AACjB;AACA;IACI,6BAA6B;AACjC;AACA;IACI,0DAA0D;IAC1D,kBAAkB;IAClB,eAAe;IACf,aAAa;AACjB;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,eAAe;AACnB;AACA;IACI,6BAA6B;IAC7B,aAAa;AACjB;AAEA;IACI,aAAa;AACjB;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,UAAU;IACV,cAAc;IACd,YAAY;IACZ,+BAA+B;IAC/B,0BAA0B;IAC1B,yBAAyB;IACzB,iBAAiB;AACrB;AAEA;IACI,wBAAwB;AAC5B;AAEA;IACI,yCAAyC;IACzC,cAAc;AAClB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;AACf",sourcesContent:[`/*! * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved. * SPDX-License-Identifier: Apache-2.0 */

<template>
    <div :id="id" class="settings-panel">
        <div class="header">
            <input
                v-bind:id="buttonId"
                style="display: none"
                type="checkbox"
                v-if="collapseable || startCollapsed"
                v-model="collapsed"
            />
            <label :for="buttonId" class="panel-header">
                <i class="preload-transition collapse-button icon icon-vscode-chevron-up" ref="icon"></i>
                <span class="settings-title">{{ title }}</span>
            </label>
            <p class="soft no-spacing mt-8">{{ description }}</p>
        </div>
        <transition
            @enter="updateHeight"
            @beforeLeave="updateHeight"
            :name="collapseable || startCollapsed ? 'collapse' : ''"
        >
            <div ref="subPane" v-show="!collapsed" class="sub-pane">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { WebviewApi } from 'vscode-webview'
import { defineComponent } from 'vue'
import saveData from '../mixins/saveData'

declare const vscode: WebviewApi<{ [key: string]: VueModel }>

let count = 0

interface VueModel {
    collapsed: boolean
    buttonId: string
    lastHeight?: number
    subPane?: HTMLElement
}

/**
 * Settings panel is header + body, which may be collapseable
 */
export default defineComponent({
    name: 'settings-panel',
    props: {
        id: String,
        startCollapsed: Boolean,
        collapseable: Boolean,
        title: String,
        description: String,
    },
    data() {
        count += 1
        return {
            collapsed: this.$props.startCollapsed ?? false,
            buttonId: \`settings-panel-button-\${count}\`,
            lastHeight: undefined,
        } as VueModel
    },
    mixins: [saveData],
    methods: {
        updateHeight(el: Element & { style?: CSSStyleDeclaration }) {
            if (el.style) {
                this.lastHeight = el.scrollHeight
                el.style.setProperty('--max-height', \`\${this.lastHeight}px\`)
            }
        },
    },
    mounted() {
        this.subPane = this.$refs.subPane as HTMLElement | undefined
        this.lastHeight = this.collapsed ? this.lastHeight : this.subPane?.scrollHeight ?? this.lastHeight

        // TODO: write 'initial-style' as a directive
        // it will force a style until the first render
        // or just use Vue's transition element, but this is pretty heavy
        this.$nextTick(() => {
            setTimeout(() => {
                ;(this.$refs.icon as HTMLElement | undefined)?.classList.remove('preload-transition')
            }, 100)
        })
    },
})
<\/script>

<style scoped>
.preload-transition {
    transition: none !important;
}
.settings-title {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
:deep(.sub-pane div:first-child) {
    margin-top: 0;
}
.collapse-leave-from {
    max-height: var(--max-height);
}
.collapse-leave-active {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to {
    max-height: var(--max-height);
    padding: 1rem;
}

.collapse-button {
    display: none;
}

input[type='checkbox'] ~ label .collapse-button {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}

input[type='checkbox']:checked ~ label .collapse-button {
    transform: rotate(90deg);
}

.settings-panel {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}

.panel-header {
    display: flex;
    align-items: center;
    width: 100%;
}
</style>
`],sourceRoot:""}]);const b=_},645:e=>{"use strict";e.exports=function(i){var s=[];return s.toString=function(){return this.map(function(o){var l="",g=typeof o[5]!="undefined";return o[4]&&(l+="@supports (".concat(o[4],") {")),o[2]&&(l+="@media ".concat(o[2]," {")),g&&(l+="@layer".concat(o[5].length>0?" ".concat(o[5]):""," {")),l+=i(o),g&&(l+="}"),o[2]&&(l+="}"),o[4]&&(l+="}"),l}).join("")},s.i=function(o,l,g,_,b){typeof o=="string"&&(o=[[null,o,void 0]]);var T={};if(g)for(var M=0;M<this.length;M++){var j=this[M][0];j!=null&&(T[j]=!0)}for(var D=0;D<o.length;D++){var v=[].concat(o[D]);g&&T[v[0]]||(typeof b!="undefined"&&(typeof v[5]=="undefined"||(v[1]="@layer".concat(v[5].length>0?" ".concat(v[5]):""," {").concat(v[1],"}")),v[5]=b),l&&(v[2]&&(v[1]="@media ".concat(v[2]," {").concat(v[1],"}")),v[2]=l),_&&(v[4]?(v[1]="@supports (".concat(v[4],") {").concat(v[1],"}"),v[4]=_):v[4]="".concat(_)),s.push(v))}},s}},537:e=>{"use strict";e.exports=function(i){var s=i[1],a=i[3];if(!a)return s;if(typeof btoa=="function"){var o=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o),g="/*# ".concat(l," */");return[s].concat([g]).join(`
`)}return[s].join(`
`)}},744:(e,i)=>{"use strict";var s;s={value:!0},i.Z=(a,o)=>{const l=a.__vccOpts||a;for(const[g,_]of o)l[g]=_;return l}},648:(e,i,s)=>{var a=s(694);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var o=s(346).Z,l=o("5af41cdc",a,!1,{})},705:(e,i,s)=>{var a=s(771);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var o=s(346).Z,l=o("8c4da830",a,!1,{})},508:(e,i,s)=>{var a=s(527);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var o=s(346).Z,l=o("05b1e884",a,!1,{})},913:(e,i,s)=>{var a=s(154);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var o=s(346).Z,l=o("cff95abe",a,!1,{})},679:(e,i,s)=>{var a=s(306);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var o=s(346).Z,l=o("7708e8a2",a,!1,{})},346:(e,i,s)=>{"use strict";s.d(i,{Z:()=>X});function a(r,h){for(var u=[],m={},p=0;p<h.length;p++){var w=h[p],A=w[0],x=w[1],k=w[2],W=w[3],E={id:r+":"+p,css:x,media:k,sourceMap:W};m[A]?m[A].parts.push(E):u.push(m[A]={id:A,parts:[E]})}return u}var o=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var l={},g=o&&(document.head||document.getElementsByTagName("head")[0]),_=null,b=0,T=!1,M=function(){},j=null,D="data-vue-ssr-id",v=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function X(r,h,u,m){T=u,j=m||{};var p=a(r,h);return L(p),function(A){for(var x=[],k=0;k<p.length;k++){var W=p[k],E=l[W.id];E.refs--,x.push(E)}A?(p=a(r,A),L(p)):p=[];for(var k=0;k<x.length;k++){var E=x[k];if(E.refs===0){for(var F=0;F<E.parts.length;F++)E.parts[F]();delete l[E.id]}}}}function L(r){for(var h=0;h<r.length;h++){var u=r[h],m=l[u.id];if(m){m.refs++;for(var p=0;p<m.parts.length;p++)m.parts[p](u.parts[p]);for(;p<u.parts.length;p++)m.parts.push(z(u.parts[p]));m.parts.length>u.parts.length&&(m.parts.length=u.parts.length)}else{for(var w=[],p=0;p<u.parts.length;p++)w.push(z(u.parts[p]));l[u.id]={id:u.id,refs:1,parts:w}}}}function R(){var r=document.createElement("style");return r.type="text/css",g.appendChild(r),r}function z(r){var h,u,m=document.querySelector("style["+D+'~="'+r.id+'"]');if(m){if(T)return M;m.parentNode.removeChild(m)}if(v){var p=b++;m=_||(_=R()),h=U.bind(null,m,p,!1),u=U.bind(null,m,p,!0)}else m=R(),h=N.bind(null,m),u=function(){m.parentNode.removeChild(m)};return h(r),function(A){if(A){if(A.css===r.css&&A.media===r.media&&A.sourceMap===r.sourceMap)return;h(r=A)}else u()}}var Z=function(){var r=[];return function(h,u){return r[h]=u,r.filter(Boolean).join(`
`)}}();function U(r,h,u,m){var p=u?"":m.css;if(r.styleSheet)r.styleSheet.cssText=Z(h,p);else{var w=document.createTextNode(p),A=r.childNodes;A[h]&&r.removeChild(A[h]),A.length?r.insertBefore(w,A[h]):r.appendChild(w)}}function N(r,h){var u=h.css,m=h.media,p=h.sourceMap;if(m&&r.setAttribute("media",m),j.ssrId&&r.setAttribute(D,h.id),p&&(u+=`
/*# sourceURL=`+p.sources[0]+" */",u+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(p))))+" */"),r.styleSheet)r.styleSheet.cssText=u;else{for(;r.firstChild;)r.removeChild(r.firstChild);r.appendChild(document.createTextNode(u))}}}},Y={};function B(e){var i=Y[e];if(i!==void 0)return i.exports;var s=Y[e]={id:e,exports:{}};return ae[e](s,s.exports,B),s.exports}B.n=e=>{var i=e&&e.__esModule?()=>e.default:()=>e;return B.d(i,{a:i}),i},B.d=(e,i)=>{for(var s in i)B.o(i,s)&&!B.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:i[s]})},B.o=(e,i)=>Object.prototype.hasOwnProperty.call(e,i),B.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var $={};(()=>{"use strict";B.r($);const e=Vue,i=n=>((0,e.pushScopeId)("data-v-3bb2cf6f"),n=n(),(0,e.popScopeId)(),n),s=i(()=>(0,e.createElementVNode)("div",{id:"configure-header"},[(0,e.createElementVNode)("h1",null,"Create a CodeCatalyst Dev Environment"),(0,e.createCommentVNode)("TODO: add link"),(0,e.createElementVNode)("span",{style:{"font-size":"0.95em"}},[(0,e.createTextVNode)(" Create an on-demand AWS instance to work on your code in the cloud. "),(0,e.createElementVNode)("a",{href:"https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/codecatalyst-devenvironment.html"}," Learn more about CodeCatalyst Dev Environments. ")])],-1)),a=i(()=>(0,e.createElementVNode)("label",{class:"options-label soft mb-8",style:{display:"block"},for:"alias-input"},"Alias",-1)),o={id:"submit-buttons",class:"mb-16"},l=["disabled"],g=["disabled"];function _(n,t,d,f,S,C){const c=(0,e.resolveComponent)("source-panel"),I=(0,e.resolveComponent)("settings-panel"),P=(0,e.resolveComponent)("compute-panel");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[s,(0,e.createVNode)(I,{id:"source-panel",title:"Source Code"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(c,{modelValue:n.source,"onUpdate:modelValue":t[0]||(t[0]=y=>n.source=y)},null,8,["modelValue"])]),_:1}),(0,e.createVNode)(I,{id:"alias-panel",title:"Alias",description:"Enter an alias to identify the Dev Environment. (Optional but recommended)"},{default:(0,e.withCtx)(()=>[a,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"alias-input",type:"text","onUpdate:modelValue":t[1]||(t[1]=y=>n.alias=y)},null,512),[[e.vModelText,n.alias]])]),_:1}),(0,e.createVNode)(I,{id:"configuration-panel",title:"Dev Environment Configuration",description:"All settings except Storage can be changed in settings after creation."},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(P,{modelValue:n.compute,"onUpdate:modelValue":t[2]||(t[2]=y=>n.compute=y),mode:"create",onEditSettings:n.editCompute},null,8,["modelValue","onEditSettings"])]),_:1}),(0,e.createElementVNode)("div",o,[(0,e.createElementVNode)("button",{class:"button-theme-secondary",onClick:t[3]||(t[3]=(...y)=>n.cancel&&n.cancel(...y)),disabled:n.creating},"Cancel",8,l),(0,e.createElementVNode)("button",{onClick:t[4]||(t[4]=(...y)=>n.submit&&n.submit(...y)),disabled:!n.canCreate},(0,e.toDisplayString)(n.creating?"Creating...":"Create Dev Environment"),9,g)])],64)}const b=n=>((0,e.pushScopeId)("data-v-6c191c15"),n=n(),(0,e.popScopeId)(),n),T={id:"compute-grid"},M={id:"size",style:{"grid-area":"size"}},j=b(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Compute",-1)),D=b(()=>(0,e.createElementVNode)("br",null,null,-1)),v={id:"timeout",style:{"grid-area":"timeout"}},X=b(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Timeout",-1)),L={id:"volume",style:{"grid-area":"volume"}},R=b(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Storage",-1)),z={key:0,class:"mt-0 mb-0"},Z={key:1};function U(n,t,d,f,S,C){return(0,e.openBlock)(),(0,e.createElementBlock)("div",null,[(0,e.createElementVNode)("div",T,[(0,e.createElementVNode)("div",M,[(0,e.createElementVNode)("div",null,[j,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(n.instance.name),1),D,(0,e.createTextVNode)(" "+(0,e.toDisplayString)(n.instance.specs),1)]),(0,e.createElementVNode)("button",{type:"button",id:"edit-size",class:"button-theme-secondary mt-8",onClick:t[0]||(t[0]=c=>n.$emit("editSettings","instanceType"))}," Edit Compute ")]),(0,e.createElementVNode)("div",v,[(0,e.createElementVNode)("div",null,[X,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(n.timeout),1)]),(0,e.createElementVNode)("button",{type:"button",id:"edit-timeout",class:"button-theme-secondary mt-8",onClick:t[1]||(t[1]=c=>n.$emit("editSettings","inactivityTimeoutMinutes"))}," Edit Timeout ")]),(0,e.createElementVNode)("div",L,[R,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(n.storage),1),n.mode==="update"?((0,e.openBlock)(),(0,e.createElementBlock)("p",z,(0,e.toDisplayString)(n.readonlyText),1)):((0,e.openBlock)(),(0,e.createElementBlock)("div",Z,[(0,e.createElementVNode)("button",{type:"button",id:"edit-storage",class:"button-theme-secondary mt-8",onClick:t[2]||(t[2]=c=>n.$emit("editSettings","persistentStorage"))}," Edit Storage Size ")]))])])])}/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class N{static registerGlobalCommands(){const t=new Event("remount");window.addEventListener("message",d=>{const{command:f}=d.data;f==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(S=>this.removeListener(S)),window.dispatchEvent(t))})}static addListener(t){this.messageListeners.add(t),window.addEventListener("message",t)}static removeListener(t){this.messageListeners.delete(t),window.removeEventListener("message",t)}static sendRequest(t,d,f){const S=JSON.parse(JSON.stringify(f)),C=new Promise((c,I)=>{const P=K=>{const V=K.data;if(t===V.id)if(this.removeListener(P),window.clearTimeout(y),V.error===!0){const G=JSON.parse(V.data);I(new Error(G.message))}else V.event?(typeof f[0]!="function"&&I(new Error(`Expected frontend event handler to be a function: ${d}`)),c(this.registerEventHandler(d,f[0]))):c(V.data)},y=setTimeout(()=>{this.removeListener(P),I(new Error(`Timed out while waiting for response: id: ${t}, command: ${d}`))},3e5);this.addListener(P)});return vscode.postMessage({id:t,command:d,data:S}),C}static registerEventHandler(t,d){const f=S=>{const C=S.data;if(C.command===t){if(!C.event)throw new Error(`Expected backend handler to be an event emitter: ${t}`);d(C.data)}};return this.addListener(f),{dispose:()=>this.removeListener(f)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(t,d)=>{var f;if(typeof d!="string"){console.warn(`Tried to index webview client with non-string property: ${String(d)}`);return}if(d==="init"){const C=(f=vscode.getState())!=null?f:{};if(C.__once)return()=>Promise.resolve();vscode.setState(Object.assign(C,{__once:!0}))}const S=(this.counter++).toString();return(...C)=>this.sendRequest(S,d,C)}})}}N.counter=0,N.initialized=!1,N.messageListeners=new Set;/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const r=new Set;window.addEventListener("remount",()=>r.clear());const u={created(){var n,t,d,f,S;if(this.$data===void 0)return;const C=(n=vscode.getState())!=null?n:{};this.$options._count=((t=this.$options._count)!=null?t:0)+1;const c=(f=this.id)!=null?f:`${(d=this.name)!=null?d:`DEFAULT-${r.size}`}-${this.$options._count}`;if(this.$options._unid=c,r.has(c)){console.warn(`Component "${c}" already exists. State-saving functionality will be disabled.`);return}r.add(c);const I=(S=C[c])!=null?S:{};Object.keys(this.$data).forEach(P=>{var y;this.$data[P]=(y=I[P])!=null?y:this.$data[P]}),Object.keys(this.$data).forEach(P=>{this.$watch(P,y=>{var K,V;const G=(K=vscode.getState())!=null?K:{},tn=Object.assign((V=G[c])!=null?V:{},{[P]:y!==void 0?JSON.parse(JSON.stringify(y)):void 0});vscode.setState(Object.assign(G,{[c]:tn}))},{deep:!0})})}};/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */function m(n){return class{constructor(t={}){Object.assign(this,n,t)}}}function p(n){return Object}const w=N.create(),A={inactivityTimeoutMinutes:15,instanceType:"dev.standard1.small",persistentStorage:{sizeInGiB:16}},x=m(A),k=(0,e.defineComponent)({name:"compute-panel",props:{modelValue:{type:p(x),default:new x},mode:{type:String,default:"update"}},data(){return{changed:{},readonlyText:"Can't be changed after creation.",descriptions:{},originalData:void 0}},mixins:[u],created(){w.getAllInstanceDescriptions().then(n=>this.descriptions=n)},watch:{model(n){if(!(n===void 0||this.originalData===void 0))for(const[t,d]of Object.entries(n))this.changed[t]=this.originalData[t]!==d},modelValue(){var n;(n=this.originalData)!=null||(this.originalData=this.modelValue)}},methods:{getNeedsRestartText(n){return this.mode==="update"&&this.changed[n]?" (needs restart)":""}},computed:{model(){return this.modelValue},instance(){const n=this.model.instanceType,t=this.descriptions[n]?{...this.descriptions[n]}:{name:"",specs:""},d=this.getNeedsRestartText("instanceType")||(n===A.instanceType?" (default)":"");return t.name=`${t.name}${d}`,t},timeout(){const n=this.model.inactivityTimeoutMinutes,t=`${n} minutes`,d=this.getNeedsRestartText("inactivityTimeoutMinutes")||(n===A.inactivityTimeoutMinutes?" (default)":"");return`${t}${d}`},storage(){const n=this.model.persistentStorage.sizeInGiB,t=`${n} GB`,d=n===A.persistentStorage.sizeInGiB?" (default)":"";return`${t}${d}`}},emits:{editSettings:n=>n!==void 0}});var W=B(648),E=B(744);const oe=(0,E.Z)(k,[["render",U],["__scopeId","data-v-6c191c15"]]),ie={class:"modes mb-16"},re=["data-disabled"],le=(0,e.createElementVNode)("span",{class:"ml-8 option-label",style:{padding:"0px"}},"Use an existing CodeCatalyst repository",-1),de=["data-disabled"],ce=(0,e.createElementVNode)("span",{class:"ml-8 option-label",style:{padding:"0px"}},"Create an empty Dev Environment",-1),pe={key:0,class:"source-pickers"},ue={class:"modes flex-sizing mt-16"},me={class:"flex-sizing mt-8"},he=(0,e.createElementVNode)("label",{class:"option-label soft"},"Space",-1),_e=(0,e.createElementVNode)("span",{class:"icon icon-lg icon-vscode-edit edit-icon"},null,-1),ve={class:"flex-sizing mt-8"},fe=(0,e.createElementVNode)("label",{class:"option-label soft"},"Project",-1),ge=["disabled"],Ae=(0,e.createElementVNode)("span",{class:"icon icon-lg icon-vscode-edit edit-icon"},null,-1),be={class:"modes flex-sizing mt-16"},ye={class:"flex-sizing"},Ce=(0,e.createElementVNode)("label",{class:"options-label soft mb-8",style:{display:"block"},for:"branch-picker"},"Branch",-1),Be=["disabled"],Ee={disabled:"",value:void 0},we=["value"],Se={class:"flex-sizing"},Pe=(0,e.createElementVNode)("label",{class:"options-label soft mb-8",style:{display:"block"},for:"branch-input"},"Create Branch - Optional for CodeCatalyst Repos",-1),xe=["placeholder","disabled"],ke={key:0,class:"input-validation"},Ie={key:1,class:"source-pickers"},De={class:"modes flex-sizing mt-16"},Ne={class:"flex-sizing mt-8"},Ve=(0,e.createElementVNode)("label",{class:"option-label soft"},"Space",-1),Te=(0,e.createElementVNode)("span",{class:"icon icon-lg icon-vscode-edit edit-icon"},null,-1),Me={class:"flex-sizing mt-8"},je=(0,e.createElementVNode)("label",{class:"option-label soft"},"Project",-1),Oe=["disabled"],$e=(0,e.createElementVNode)("span",{class:"icon icon-lg icon-vscode-edit edit-icon"},null,-1);function Le(n,t,d,f,S,C){return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("div",ie,[(0,e.createElementVNode)("label",{class:"mode-container","data-disabled":n.model.type!=="linked"},[(0,e.withDirectives)((0,e.createElementVNode)("input",{class:"radio",type:"radio",name:"mode",id:"from-code-catalyst","onUpdate:modelValue":t[0]||(t[0]=c=>n.model.type=c),value:"linked"},null,512),[[e.vModelRadio,n.model.type]]),le],8,re),(0,e.createElementVNode)("label",{class:"mode-container","data-disabled":n.model.type!=="none"},[(0,e.withDirectives)((0,e.createElementVNode)("input",{class:"radio",type:"radio",name:"mode",id:"from-none","onUpdate:modelValue":t[1]||(t[1]=c=>n.model.type=c),value:"none"},null,512),[[e.vModelRadio,n.model.type]]),ce],8,de)]),n.model.type==="linked"?((0,e.openBlock)(),(0,e.createElementBlock)("div",pe,[(0,e.createElementVNode)("div",ue,[(0,e.createElementVNode)("span",me,[he,(0,e.createElementVNode)("button",{class:"project-button",onClick:t[2]||(t[2]=c=>n.quickPickSpace())},[(0,e.createTextVNode)((0,e.toDisplayString)(n.selectedSpaceName)+" ",1),_e])]),(0,e.createElementVNode)("span",ve,[fe,(0,e.createElementVNode)("button",{class:"project-button",onClick:t[3]||(t[3]=c=>n.quickPickProject()),disabled:!n.isSpaceSelected},[(0,e.createTextVNode)((0,e.toDisplayString)(n.selectedProjectName)+" ",1),Ae],8,ge)])]),(0,e.createElementVNode)("div",be,[(0,e.createCommentVNode)(" Existing branch "),(0,e.createElementVNode)("span",ye,[Ce,(0,e.withDirectives)((0,e.createElementVNode)("select",{id:"branch-picker",class:"picker",disabled:!n.model.selectedProject,"onUpdate:modelValue":t[4]||(t[4]=c=>n.model.selectedBranch=c),onInput:t[5]||(t[5]=(...c)=>n.update&&n.update(...c))},[(0,e.createElementVNode)("option",Ee,(0,e.toDisplayString)(n.branchPlaceholder),1),((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(n.availableBranches,c=>((0,e.openBlock)(),(0,e.createElementBlock)("option",{key:c.id,value:c},(0,e.toDisplayString)(n.branchName(c)),9,we))),128))],40,Be),[[e.vModelSelect,n.model.selectedBranch]])]),(0,e.createCommentVNode)(" New Branch "),(0,e.createElementVNode)("span",Se,[Pe,(0,e.withDirectives)((0,e.createElementVNode)("input",{id:"branch-input",type:"text",placeholder:n.newBranchNamePlaceholder,disabled:!n.newBranchNameAllowed,"onUpdate:modelValue":t[6]||(t[6]=c=>n.model.newBranch=c),onInput:t[7]||(t[7]=(...c)=>n.update&&n.update(...c))},null,40,xe),[[e.vModelText,n.model.newBranch]]),n.branchError?((0,e.openBlock)(),(0,e.createElementBlock)("div",ke,(0,e.toDisplayString)(n.branchError),1)):(0,e.createCommentVNode)("v-if",!0)])])])):(0,e.createCommentVNode)("v-if",!0),n.model.type==="none"?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ie,[(0,e.createElementVNode)("div",De,[(0,e.createElementVNode)("span",Ne,[Ve,(0,e.createElementVNode)("button",{class:"project-button",onClick:t[8]||(t[8]=c=>n.quickPickSpace())},[(0,e.createTextVNode)((0,e.toDisplayString)(n.selectedSpaceName)+" ",1),Te])]),(0,e.createElementVNode)("span",Me,[je,(0,e.createElementVNode)("button",{class:"project-button",onClick:t[9]||(t[9]=c=>n.quickPickProject()),disabled:!n.isSpaceSelected},[(0,e.createTextVNode)((0,e.toDisplayString)(n.selectedProjectName)+" ",1),$e],8,Oe)])])])):(0,e.createCommentVNode)("v-if",!0)],64)}const H=N.create();function ee(n){return n.type==="linked"?!!n.selectedProject&&!!n.selectedBranch&&!n.branchError:n.type==="none"?!!n.selectedProject:!1}const J=m({type:"linked"}),Re=(0,e.defineComponent)({name:"source-code",props:{modelValue:{type:p(J),default:new J}},data(){return{projects:[],branches:{},loadingProjects:!1,loadingBranches:{},newBranchNameAllowed:!1,newBranchNamePlaceholder:"Select branch first..."}},async created(){this.loadingProjects=!0},watch:{async"model.selectedProject"(n){var t,d,f;this.useFirstBranch(),n&&!this.branches[n.name]&&(this.loadingBranches[n.name]=!0,(f=(t=this.branches)[d=n.name])!=null||(t[d]=await H.getBranches(n).finally(()=>{this.loadingBranches[n.name]=!1})),this.useFirstBranch())},async"model.selectedBranch"(n){if(this.model.type!=="linked"||n===void 0){this.newBranchNameAllowed=!1,this.newBranchNamePlaceholder="";return}this.newBranchNameAllowed=!1,this.newBranchNamePlaceholder="Loading...";const t=this.model.newBranch;this.$emit("update:modelValue",{...this.model,newBranch:void 0}),await H.isThirdPartyRepo({spaceName:n.org.name,projectName:n.project.name,sourceRepositoryName:n.repo.name})?(this.newBranchNamePlaceholder="Not Applicable for Linked Repo",this.newBranchNameAllowed=!1,this.$emit("update:modelValue",{...this.model,newBranch:void 0})):(this.newBranchNamePlaceholder="branch-name",this.newBranchNameAllowed=!0,this.$emit("update:modelValue",{...this.model,newBranch:t}))}},computed:{model(){return this.modelValue},loading(){var n;return this.model.type!=="linked"||!this.model.selectedProject?!1:(n=this.loadingBranches[this.model.selectedProject.name])!=null?n:!1},branchPlaceholder(){var n,t;return this.loading?"Loading...":((t=(n=this.availableBranches)==null?void 0:n.length)!=null?t:0)===0?"No branches found":"Select a branch"},availableBranches(){return this.model.type!=="linked"||!this.model.selectedProject?[]:this.branches[this.model.selectedProject.name]},branchError(){var n;if(this.model.type!=="linked"||!this.model.newBranch)return;const t=this.model.newBranch;if(!!t&&((n=this.availableBranches)==null?void 0:n.find(d=>d.name===`refs/heads/${t}`))!==void 0)return"Branch already exists"},isSpaceSelected(){return!!this.model.selectedSpace},isProjectSelected(){return!!this.model.selectedProject},selectedSpaceName(){return this.model.selectedSpace===void 0?"Not Selected":this.model.selectedSpace.name},selectedProjectName(){return this.model.selectedProject===void 0?"Not Selected":this.model.selectedProject.name}},methods:{update(){this.model.branchError=this.branchError,this.$emit("update:modelValue",this.model)},branchName(n){return`${n.repo.name} / ${n.name.replace("refs/heads/","")}`},useFirstBranch(){var n;this.model.type==="linked"&&(Object.assign(this.model,{selectedBranch:(n=this.availableBranches)==null?void 0:n[0]}),this.update())},async quickPickSpace(){const n=await H.quickPickSpace();n!==void 0&&this.$emit("update:modelValue",{...this.modelValue,selectedSpace:n,selectedProject:void 0})},async quickPickProject(){const n=this.modelValue.selectedSpace;if(n===void 0)return;const t=await H.quickPickProject(n.name);t!==void 0&&this.$emit("update:modelValue",{...this.modelValue,selectedProject:t})}},emits:{"update:modelValue":n=>!0}});var sn=B(913);const ze=(0,E.Z)(Re,[["render",Le]]),on=n=>(_pushScopeId("data-v-3858c4ad"),n=n(),_popScopeId(),n),Ue=["id"],We={class:"header"},Fe=["id"],He=["for"],Ke={class:"preload-transition collapse-button icon icon-vscode-chevron-up",ref:"icon"},Ge={class:"settings-title"},Xe={class:"soft no-spacing mt-8"},Ze={ref:"subPane",class:"sub-pane"};function Je(n,t,d,f,S,C){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{id:n.id,class:"settings-panel"},[(0,e.createElementVNode)("div",We,[n.collapseable||n.startCollapsed?(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("input",{key:0,id:n.buttonId,style:{display:"none"},type:"checkbox","onUpdate:modelValue":t[0]||(t[0]=c=>n.collapsed=c)},null,8,Fe)),[[e.vModelCheckbox,n.collapsed]]):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("label",{for:n.buttonId,class:"panel-header"},[(0,e.createElementVNode)("i",Ke,null,512),(0,e.createElementVNode)("span",Ge,(0,e.toDisplayString)(n.title),1)],8,He),(0,e.createElementVNode)("p",Xe,(0,e.toDisplayString)(n.description),1)]),(0,e.createVNode)(e.Transition,{onEnter:n.updateHeight,onBeforeLeave:n.updateHeight,name:n.collapseable||n.startCollapsed?"collapse":""},{default:(0,e.withCtx)(()=>[(0,e.withDirectives)((0,e.createElementVNode)("div",Ze,[(0,e.renderSlot)(n.$slots,"default",{},void 0,!0)],512),[[e.vShow,!n.collapsed]])]),_:3},8,["onEnter","onBeforeLeave","name"])],8,Ue)}let ne=0;const Ye=(0,e.defineComponent)({name:"settings-panel",props:{id:String,startCollapsed:Boolean,collapseable:Boolean,title:String,description:String},data(){var n;return ne+=1,{collapsed:(n=this.$props.startCollapsed)!=null?n:!1,buttonId:`settings-panel-button-${ne}`,lastHeight:void 0}},mixins:[u],methods:{updateHeight(n){n.style&&(this.lastHeight=n.scrollHeight,n.style.setProperty("--max-height",`${this.lastHeight}px`))}},mounted(){var n,t;this.subPane=this.$refs.subPane,this.lastHeight=this.collapsed?this.lastHeight:(t=(n=this.subPane)==null?void 0:n.scrollHeight)!=null?t:this.lastHeight,this.$nextTick(()=>{setTimeout(()=>{var d;(d=this.$refs.icon)==null||d.classList.remove("preload-transition")},100)})}});var rn=B(679);const Qe=(0,E.Z)(Ye,[["render",Je],["__scopeId","data-v-3858c4ad"]]),O=N.create(),qe={source:new J,compute:new x,creating:!1,alias:""},en=(0,e.defineComponent)({name:"create",components:{settingsPanel:Qe,computePanel:oe,sourcePanel:ze},mixins:[u],data(){return qe},computed:{canCreate(){return!this.creating&&ee(this.source)}},created(){},watch:{"source.selectedProject"(){this.compute=new x}},methods:{async editCompute(n){var t;const d={...this.compute,alias:this.alias},f=await O.editSetting(d,n,(t=this.source.selectedProject)==null?void 0:t.org);n!=="alias"?this.compute=new x(f):f.alias!==void 0&&(this.alias=f.alias)},async submit(){if(!(!this.canCreate||!ee(this.source))){this.creating=!0;try{const n={...this.compute,alias:this.alias};await O.submit(n,this.source),O.close()}catch(n){n.message.match(/cancelled/i)||O.showLogsMessage(`Failed to create Dev Environment: ${n.message}`)}finally{this.creating=!1}}},cancel(){O.close()}}});var dn=B(705),cn=B(508);const nn=(0,E.Z)(en,[["render",_],["__scopeId","data-v-3bb2cf6f"]]);/*!
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const te=()=>(0,e.createApp)(nn),se=te();se.mount("#vue-app"),window.addEventListener("remount",()=>{se.unmount(),te().mount("#vue-app")})})();var Q=this;for(var q in $)Q[q]=$[q];$.__esModule&&Object.defineProperty(Q,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map