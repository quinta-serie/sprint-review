import { useState } from 'react';

import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MuiFormGroup from '@mui/material/FormGroup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';

import { slug } from '@/utils/string';
import { COLORS } from '@/services/template';
import Form, { Control, FormGroup } from '@/components/Form';

import type { TemplateFormData } from './interface';

function InputColumns({ formGroup }: { formGroup: FormGroup<TemplateFormData> }) {
    const [input, setInput] = useState('');

    const addColumn = () => {
        const lastIndexColumn = formGroup.controls.columns.value.length;

        formGroup.setValues({
            columns: [...formGroup.controls.columns.value, {
                name: input,
                slug: slug(input),
                color: COLORS[lastIndexColumn]
            }]
        });

        setInput('');
    };

    const updateInput = (e: React.FormEvent<HTMLDivElement>) => { setInput(e.target['value']); };

    const handleDeleteColumn = (index: number) => {
        const columns = formGroup.controls.columns.value.filter((_, i) => i !== index);

        formGroup.setValues({ columns });

        setInput('');
    };

    return (
        <Box>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>Colunas</Typography>
            <OutlinedInput
                fullWidth
                size="small"
                value={input}
                placeholder="Ex: To Do, In Progress, Done"
                onInput={updateInput}
                sx={{ marginBottom: 2 }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton edge="end" onClick={addColumn}>
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
            <Box>
                {
                    formGroup.controls.columns.value.map((column, index) => (
                        <Zoom in key={column.slug}>
                            <Chip
                                label={column.name}
                                variant="outlined"
                                sx={{ mr: 2, mb: 2 }}
                                avatar={<Avatar>{index + 1}</Avatar>}
                                onDelete={() => handleDeleteColumn(index)}
                            />
                        </Zoom>
                    ))
                }
                {
                    formGroup.controls.columns.isInvalid && (
                        <Typography variant="subtitle2" color="error">
                            {formGroup.controls.columns.error}
                        </Typography>
                    )
                }
            </Box>
        </Box>
    );
}

interface TemplateFormProps {
    shouldOmitName?: boolean;
    shouldOmitTimer?: boolean;
    shouldOmitColumns?: boolean;
    children?: React.JSX.Element;
    formGroup: FormGroup<TemplateFormData>;
}
export default function TemplateForm({
    children,
    formGroup,
    shouldOmitName = false,
    shouldOmitTimer = true,
    shouldOmitColumns = false,
}: TemplateFormProps) {
    return (
        <Form formGroup={formGroup}>
            <Stack spacing={2}>
                {
                    !shouldOmitName && (
                        <Box>
                            <Typography
                                gutterBottom
                                variant="subtitle2"
                                color="text.primary"
                            >
                                Nome do Board
                            </Typography>
                            <Control controlName="name">
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    placeholder="Ex: Retrospectiva"
                                    value={formGroup.controls.name.value}
                                    error={formGroup.controls.name.isInvalid}
                                    helperText={formGroup.controls.name.isInvalid && formGroup.controls.name.error}
                                />
                            </Control>
                        </Box>
                    )
                }
                <Box>
                    <Typography variant="subtitle2" color="text.primary" gutterBottom>Votos por pessoa</Typography>
                    <Control controlName="maxVotesPerUser" action="onChange">
                        <Slider
                            marks
                            min={1}
                            max={10}
                            shiftStep={1}
                            value={formGroup.controls.maxVotesPerUser.value}
                            valueLabelDisplay="auto"
                        />
                    </Control>
                </Box>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                            variant="subtitle2"
                            gutterBottom
                            color="text.primary"
                        >
                            Votos individuais por card
                        </Typography>
                        <Tooltip
                            placement="right"
                            title="Quantidade de votos que cada pessoa pode votar em um único card"
                        >
                            <InfoIcon color="action" />
                        </Tooltip>
                    </Stack>
                    <Control controlName="maxVotesPerCard" action="onChange">
                        <Slider
                            marks
                            min={1}
                            max={10}
                            shiftStep={1}
                            value={formGroup.controls.maxVotesPerCard.value}
                            valueLabelDisplay="auto"
                        />
                    </Control>
                    {
                        formGroup.controls.maxVotesPerCard.isInvalid && (
                            <Typography variant="body2" color="error">
                                {formGroup.controls.maxVotesPerCard.error}
                            </Typography>
                        )
                    }
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="text.primary" gutterBottom>Configurações</Typography>
                    <MuiFormGroup>
                        <FormControlLabel
                            label="Ocultar cards"
                            sx={{ color: 'text.primary' }}
                            control={
                                <Control
                                    type="checkbox"
                                    action="onChange"
                                    controlName="hideCardsInitially"
                                >
                                    <Switch checked={formGroup.controls.hideCardsInitially.value} />
                                </Control>
                            }
                        />
                        <FormControlLabel
                            label="Ocultar autor do card"
                            sx={{ color: 'text.primary' }}
                            control={
                                <Control
                                    type="checkbox"
                                    action="onChange"
                                    controlName="hideCardsAutor"
                                >
                                    <Switch checked={formGroup.controls.hideCardsAutor.value} />
                                </Control>
                            }
                        />
                        <FormControlLabel
                            label="Ocultar reações"
                            sx={{ color: 'text.primary' }}
                            control={
                                <Control
                                    type="checkbox"
                                    action="onChange"
                                    controlName="hideReactions"
                                >
                                    <Switch checked={formGroup.controls.hideReactions.value} />
                                </Control>
                            }
                        />
                    </MuiFormGroup>
                </Box>

                {
                    !shouldOmitTimer && (
                        <Box>
                            <Typography variant="body2" mb={2}>Contador regressivo</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TimerIcon sx={{ color: 'text.primary' }} />
                                <Control controlName="timer">
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        sx={{ width: '50px' }}
                                        value={formGroup.controls.timer.value}
                                        error={formGroup.controls.timer.isInvalid}
                                        helperText={
                                            formGroup.controls.timer.isInvalid && formGroup.controls.timer.error
                                        }
                                    />
                                </Control>
                                <Typography variant="subtitle2" color="text.primary">Minutos</Typography>
                                <Tooltip
                                    placement="right"
                                    title="Ao adicionar um novo valor seu contador ativo será resetado"
                                >
                                    <InfoIcon />
                                </Tooltip>
                            </Stack>
                        </Box>
                    )
                }

                {!shouldOmitColumns && <InputColumns formGroup={formGroup} />}

                {children}
            </Stack>
        </Form>
    );
}