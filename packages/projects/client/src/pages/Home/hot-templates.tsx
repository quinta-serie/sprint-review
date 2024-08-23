import React from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import MuiFormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import DialogContentText from '@mui/material/DialogContentText';
import { Typography } from '@mui/material';

import { userServices } from '@/services/core';
import { truthsAndLies } from '@/services/board';
import type { TeamPopulated } from '@/services/team';
import Form, { Control, FormControl, FormGroup, useForm } from '@/components/Form';

import useTeams from '../Teams/useTeams';

interface HotTemplateForm { teamId: string; }

interface HotTemplateProps { onClose: () => void }

function useFormHotTemplate(subtmitCallback: (form: FormGroup<HotTemplateForm>) => void, deps: any[] = []) {
    const [formGroup] = useForm<HotTemplateForm>({
        form: {
            teamId: new FormControl({ value: '', required: true })
        },
        handle: {
            submit: async (form) => { subtmitCallback(form); }
        }
    }, [...deps]);

    return formGroup;
}

interface ModalPatternProps { children: React.ReactNode; onClose: () => void; formGroup: FormGroup<HotTemplateForm>; }
function ModalPattern({ children, formGroup, onClose }: ModalPatternProps) {
    const { myTeams } = useTeams();

    return (
        <DialogContent>
            <Stack spacing={2}>
                {children}
                <Form formGroup={formGroup}>
                    <MuiFormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Selecione um time</InputLabel>
                        <Control controlName="teamId" action="onChange">
                            <Select
                                label="Selecione um time"
                                value={formGroup.controls.teamId.value}
                                error={formGroup.controls.teamId.isInvalid}
                            >
                                {
                                    myTeams.map(team => (
                                        <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Control>
                        {
                            formGroup.controls.teamId.isInvalid && (
                                <FormHelperText error>{formGroup.controls.teamId.error}</FormHelperText>
                            )
                        }
                    </MuiFormControl>
                    <DialogActions sx={{ mt: 2 }}>
                        <Button color="inherit" variant="outlined" onClick={onClose}>Fechar</Button>
                        <Button type="submit" color="primary" variant="contained">Criar</Button>
                    </DialogActions>
                </Form>
            </Stack>
        </DialogContent>
    );
}

export function TruthsAndLies({ onClose }: HotTemplateProps) {
    const { myTeams, addTeamBoard } = useTeams();

    const { user_id } = userServices.current;

    const formGroup = useFormHotTemplate((form) => {
        const { teamId } = form.values;
        const currentTeam = myTeams.find(team => team.id === teamId) as TeamPopulated;

        addTeamBoard(teamId, truthsAndLies({
            teamId,
            ownerId: user_id,
            members: currentTeam.members.map(m => m.name)
        }));
    });

    return (
        <ModalPattern formGroup={formGroup} onClose={onClose}>
            <DialogContentText>
                {/* eslint-disable */}
                <div>
                    thruthsAndLies
                    <Typography variant="h3">Work in progress...</Typography>
                    {/* <strong>Objetivo:</strong><br /> Esse template é utilizado para dinâmicas de <strong>team building</strong>.
                    <br /><br />
                    Conheça seus colegas de equipe e descubra mais sobre eles.
                    <ol style={{ listStyleType: 'upper-roman' }}>
                        <li>Cada membro da equipe deve escrever 2 fatos sobre si mesmo e uma mentira em cartões separados.</li>
                        <li>Em seguida, cada membro da equipe deve compartilhar seus cartões com o grupo.</li>
                        <li>Vamos gerar um card com uma legenda identificando cada membro da equipe.</li>
                        <li>O grupo deve adicionar reações aos cards de acordo com a legenda, tentando identificar qual colega escreveu aquele card.</li>
                        <li>Depois disso o dono do board deve desabilitar a opção "Ocultar autor do card", mostrando assim se o time conseguiu adivinhar corretamente o autor</li>
                        <li>Em seguida o grupo deve arrastar os cards para as colunas de verdade ou mentira</li>
                        <li>Após os membros do grupo terem conversado sobre a, cada membro deve revelar a mentira.</li>
                    </ol> */}
                </div>
                {/* eslint-enable */}
            </DialogContentText>
        </ModalPattern>
    );
}

export function Standard({ onClose }: HotTemplateProps) {
    const { myTeams, addTeamBoard } = useTeams();

    const { user_id } = userServices.current;

    const formGroup = useFormHotTemplate((form) => {
        const { teamId } = form.values;
        const currentTeam = myTeams.find(team => team.id === teamId) as TeamPopulated;

        addTeamBoard(teamId, truthsAndLies({
            teamId,
            ownerId: user_id,
            members: currentTeam.members.map(m => m.name)
        }));
    });

    return (
        <ModalPattern formGroup={formGroup} onClose={onClose}>
            <DialogContentText>
                {/* eslint-disable */}
                <div>
                    standardTemplate
                    <Typography variant="h3">Work in progress...</Typography>
                </div>
                {/* eslint-enable */}
            </DialogContentText>
        </ModalPattern>
    );
}

export function Generic({ onClose }: HotTemplateProps) {
    const { myTeams, addTeamBoard } = useTeams();

    const { user_id } = userServices.current;

    const formGroup = useFormHotTemplate((form) => {
        const { teamId } = form.values;
        const currentTeam = myTeams.find(team => team.id === teamId) as TeamPopulated;

        addTeamBoard(teamId, truthsAndLies({
            teamId,
            ownerId: user_id,
            members: currentTeam.members.map(m => m.name)
        }));
    });

    return (
        <ModalPattern formGroup={formGroup} onClose={onClose}>
            <DialogContentText>
                {/* eslint-disable */}
                <div>
                    Generic
                    <Typography variant="h3">Work in progress...</Typography>
                </div>
                {/* eslint-enable */}
            </DialogContentText>
        </ModalPattern>
    );
}

const HOT_TEMPLATES = {
    Generic,
    Standard,
    TruthsAndLies,
} as const;

export type HotTamplateName = keyof typeof HOT_TEMPLATES;

export default {
    Generic,
    Standard,
    TruthsAndLies,
} as { [x in HotTamplateName]: (props: HotTemplateProps) => JSX.Element };